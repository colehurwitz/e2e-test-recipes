#!/usr/bin/env python3
import json
import os
import re
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

REQUIRED_FILES = ["index.html", "styles.css", "app.js"]

CSS_CUSTOM_PROPERTIES = [
    "--bg-primary",
    "--bg-secondary",
    "--bg-card",
    "--text-primary",
    "--text-secondary",
    "--accent",
    "--border",
    "--shadow",
]


def read_file(filename):
    path = os.path.join(PROJECT_ROOT, filename)
    if not os.path.isfile(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    return content if content.strip() else None


def check_file_existence():
    results = {}
    for f in REQUIRED_FILES:
        content = read_file(f)
        results[f] = content is not None
    return results


def check_html_structure(content):
    if content is None:
        return {"doctype": False, "head": False, "body": False, "links_css": False, "links_js": False}
    text = content.lower()
    return {
        "doctype": "<!doctype html>" in text,
        "head": "<head" in text and "</head>" in text,
        "body": "<body" in text and "</body>" in text,
        "links_css": 'href="styles.css"' in content or "href='styles.css'" in content,
        "links_js": 'src="app.js"' in content or "src='app.js'" in content,
    }


def check_css_custom_properties(content):
    if content is None:
        return {"has_root": False, "properties_found": 0, "properties_total": len(CSS_CUSTOM_PROPERTIES)}
    has_root = ":root" in content
    found = sum(1 for prop in CSS_CUSTOM_PROPERTIES if prop in content)
    return {
        "has_root": has_root,
        "properties_found": found,
        "properties_total": len(CSS_CUSTOM_PROPERTIES),
    }


def check_js_recipe_data(content):
    if content is None:
        return {"has_array": False, "recipe_count": 0, "has_required_fields": False}

    array_match = re.search(r"(?:const|let|var)\s+\w+\s*=\s*\[", content)
    has_array = array_match is not None

    object_blocks = re.findall(r"\{[^{}]{50,}\}", content, re.DOTALL)
    required_fields = ["id", "title", "category", "ingredients", "instructions", "prepTime", "servings"]
    recipe_count = 0
    for block in object_blocks:
        if all(f'"{field}"' in block or f"'{field}'" in block or re.search(rf"\b{field}\s*:", block) for field in required_fields):
            recipe_count += 1

    return {
        "has_array": has_array,
        "recipe_count": recipe_count,
        "has_required_fields": recipe_count >= 5,
    }


def compute_score():
    html = read_file("index.html")
    css = read_file("styles.css")
    js = read_file("app.js")

    file_checks = check_file_existence()
    html_checks = check_html_structure(html)
    css_checks = check_css_custom_properties(css)
    js_checks = check_js_recipe_data(js)

    file_score = sum(file_checks.values()) / len(file_checks) if file_checks else 0

    html_parts = list(html_checks.values())
    html_score = sum(html_parts) / len(html_parts) if html_parts else 0

    css_root = 1.0 if css_checks["has_root"] else 0.0
    css_props = css_checks["properties_found"] / css_checks["properties_total"] if css_checks["properties_total"] else 0
    css_score = (css_root + css_props) / 2

    js_array = 1.0 if js_checks["has_array"] else 0.0
    js_fields = 1.0 if js_checks["has_required_fields"] else 0.0
    js_count = min(js_checks["recipe_count"] / 5, 1.0)
    js_score = (js_array + js_fields + js_count) / 3

    composite = (file_score * 0.2) + (html_score * 0.25) + (css_score * 0.25) + (js_score * 0.3)

    return {
        "composite": round(composite, 4),
        "dimensions": {
            "file_existence": {"score": round(file_score, 4), "details": file_checks},
            "html_structure": {"score": round(html_score, 4), "details": html_checks},
            "css_custom_properties": {"score": round(css_score, 4), "details": css_checks},
            "js_recipe_data": {"score": round(js_score, 4), "details": js_checks},
        },
    }


if __name__ == "__main__":
    result = compute_score()
    print(json.dumps(result, indent=2))
