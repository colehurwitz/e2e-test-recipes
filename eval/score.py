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


def check_search_feature(html, js):
    html_has_input = False
    if html:
        html_has_input = 'id="search-input"' in html or "id='search-input'" in html
    js_has_listener = False
    js_has_filter = False
    if js:
        js_has_listener = "search-input" in js and ("addEventListener" in js or "oninput" in js)
        js_has_filter = "filter" in js and ("indexOf" in js or "includes" in js or "search" in js or "match" in js)
    return {
        "html_has_search_input": html_has_input,
        "js_has_search_listener": js_has_listener,
        "js_has_filter_logic": js_has_filter,
    }


def check_category_filter(html, js):
    html_has_filters = False
    if html:
        html_has_filters = "category-filters" in html or "filter-btn" in html
    js_has_category_logic = False
    if js:
        js_has_category_logic = "category" in js.lower() and ("active" in js or "filter" in js)
    return {
        "html_has_filter_buttons": html_has_filters,
        "js_has_category_logic": js_has_category_logic,
    }


def check_detail_view(html, css, js):
    html_has_modal = False
    if html:
        html_has_modal = ("modal" in html.lower() or "overlay" in html.lower() or "detail" in html.lower())
    css_has_modal_style = False
    if css:
        css_has_modal_style = ".modal" in css or ".overlay" in css or ".detail-view" in css
    js_has_open_close = False
    if js:
        has_open = "openModal" in js or "showDetail" in js or "showModal" in js
        has_close = "closeModal" in js or "hideDetail" in js or "hideModal" in js
        js_has_open_close = has_open and has_close
    return {
        "html_has_modal_container": html_has_modal,
        "css_has_modal_styles": css_has_modal_style,
        "js_has_open_close_handlers": js_has_open_close,
    }


def check_dark_mode(html, css, js):
    css_has_dark_theme = False
    css_dark_properties = 0
    if css:
        css_has_dark_theme = 'data-theme="dark"' in css or "data-theme='dark'" in css
        if css_has_dark_theme:
            dark_section_match = re.search(r'\[data-theme=["\']dark["\']\]\s*\{([^}]+)\}', css)
            if dark_section_match:
                dark_block = dark_section_match.group(1)
                css_dark_properties = sum(1 for prop in CSS_CUSTOM_PROPERTIES if prop in dark_block)

    html_has_toggle = False
    html_has_fouc_script = False
    if html:
        html_has_toggle = "theme-toggle" in html
        html_has_fouc_script = "localStorage" in html and "data-theme" in html

    js_has_toggle = False
    js_has_localstorage = False
    if js:
        js_has_toggle = "toggleTheme" in js or "theme-toggle" in js
        js_has_localstorage = "localStorage" in js and "theme" in js

    return {
        "css_has_dark_theme": css_has_dark_theme,
        "css_dark_properties": css_dark_properties,
        "css_dark_properties_total": len(CSS_CUSTOM_PROPERTIES),
        "html_has_toggle_button": html_has_toggle,
        "html_has_fouc_prevention": html_has_fouc_script,
        "js_has_toggle_logic": js_has_toggle,
        "js_has_localstorage_persistence": js_has_localstorage,
    }


def compute_score():
    html = read_file("index.html")
    css = read_file("styles.css")
    js = read_file("app.js")

    file_checks = check_file_existence()
    html_checks = check_html_structure(html)
    css_checks = check_css_custom_properties(css)
    js_checks = check_js_recipe_data(js)
    search_checks = check_search_feature(html, js)
    filter_checks = check_category_filter(html, js)
    detail_checks = check_detail_view(html, css, js)
    dark_mode_checks = check_dark_mode(html, css, js)

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

    search_parts = list(search_checks.values())
    search_score = sum(search_parts) / len(search_parts) if search_parts else 0

    filter_parts = list(filter_checks.values())
    filter_score = sum(filter_parts) / len(filter_parts) if filter_parts else 0

    detail_parts = list(detail_checks.values())
    detail_score = sum(detail_parts) / len(detail_parts) if detail_parts else 0

    dm_has_theme = 1.0 if dark_mode_checks["css_has_dark_theme"] else 0.0
    dm_props = dark_mode_checks["css_dark_properties"] / dark_mode_checks["css_dark_properties_total"] if dark_mode_checks["css_dark_properties_total"] else 0
    dm_toggle_btn = 1.0 if dark_mode_checks["html_has_toggle_button"] else 0.0
    dm_fouc = 1.0 if dark_mode_checks["html_has_fouc_prevention"] else 0.0
    dm_js_toggle = 1.0 if dark_mode_checks["js_has_toggle_logic"] else 0.0
    dm_js_storage = 1.0 if dark_mode_checks["js_has_localstorage_persistence"] else 0.0
    dark_mode_score = (dm_has_theme + dm_props + dm_toggle_btn + dm_fouc + dm_js_toggle + dm_js_storage) / 6

    composite = (
        (file_score * 0.10)
        + (html_score * 0.10)
        + (css_score * 0.10)
        + (js_score * 0.15)
        + (search_score * 0.15)
        + (filter_score * 0.10)
        + (detail_score * 0.15)
        + (dark_mode_score * 0.15)
    )

    return {
        "composite": round(composite, 4),
        "dimensions": {
            "file_existence": {"score": round(file_score, 4), "details": file_checks},
            "html_structure": {"score": round(html_score, 4), "details": html_checks},
            "css_custom_properties": {"score": round(css_score, 4), "details": css_checks},
            "js_recipe_data": {"score": round(js_score, 4), "details": js_checks},
            "search_feature": {"score": round(search_score, 4), "details": search_checks},
            "category_filter": {"score": round(filter_score, 4), "details": filter_checks},
            "detail_view": {"score": round(detail_score, 4), "details": detail_checks},
            "dark_mode": {"score": round(dark_mode_score, 4), "details": dark_mode_checks},
        },
    }


if __name__ == "__main__":
    result = compute_score()
    print(json.dumps(result, indent=2))
