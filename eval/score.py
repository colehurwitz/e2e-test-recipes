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


def check_rating_system(css, js):
    css_has_star_styles = False
    css_has_star_color_var = False
    if css:
        css_has_star_styles = ".star" in css or "star-rating" in css
        css_has_star_color_var = "--star-color" in css

    js_has_star_elements = False
    js_has_data_value = False
    js_has_localstorage_ratings = False
    js_has_average_calc = False
    js_has_click_handler = False
    js_has_hover_handler = False
    js_has_duplicate_prevention = False
    js_has_review_storage = False
    if js:
        js_has_star_elements = "★" in js or "☆" in js
        js_has_data_value = "data-value" in js
        js_has_localstorage_ratings = "recipe-ratings" in js and "localStorage" in js
        js_has_average_calc = "average" in js and ("reduce" in js or "sum" in js)
        js_has_click_handler = "click" in js and ("addRating" in js or "rating" in js.lower())
        js_has_hover_handler = "mouseenter" in js or "mouseover" in js or "hover" in js
        js_has_duplicate_prevention = "rated-recipes" in js or "hasRated" in js
        js_has_review_storage = "recipe-reviews" in js or "review" in js.lower()

    return {
        "css_has_star_styles": css_has_star_styles,
        "css_has_star_color_var": css_has_star_color_var,
        "js_has_star_elements": js_has_star_elements,
        "js_has_data_value": js_has_data_value,
        "js_has_localstorage_ratings": js_has_localstorage_ratings,
        "js_has_average_calc": js_has_average_calc,
        "js_has_click_handler": js_has_click_handler,
        "js_has_hover_handler": js_has_hover_handler,
        "js_has_duplicate_prevention": js_has_duplicate_prevention,
        "js_has_review_storage": js_has_review_storage,
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


def check_pdf_export(css, js):
    css_has_media_print = False
    css_has_page_rule = False
    css_hides_non_content = False
    css_hides_interactive = False
    css_has_high_contrast = False
    css_has_break_inside = False
    css_has_print_typography = False
    if css:
        css_has_media_print = "@media print" in css
        css_has_page_rule = "@page" in css
        css_hides_non_content = "visibility: hidden" in css and "visibility: visible" in css
        css_hides_interactive = (
            css_has_media_print
            and ("display: none" in css or "display:none" in css)
            and (".modal-close" in css or ".modal-rating" in css or ".export-pdf-btn" in css)
        )
        css_has_high_contrast = "color: #000" in css or "color:#000" in css
        css_has_break_inside = "break-inside" in css
        css_has_print_typography = "12pt" in css

    js_has_export_btn = False
    js_has_window_print = False
    js_has_title_swap = False
    js_has_afterprint = False
    if js:
        js_has_export_btn = "export-pdf-btn" in js or "export-pdf" in js
        js_has_window_print = "window.print()" in js
        js_has_title_swap = "document.title" in js
        js_has_afterprint = "afterprint" in js

    return {
        "css_has_media_print": css_has_media_print,
        "css_has_page_rule": css_has_page_rule,
        "css_hides_non_content": css_hides_non_content,
        "css_hides_interactive": css_hides_interactive,
        "css_has_high_contrast": css_has_high_contrast,
        "css_has_break_inside": css_has_break_inside,
        "css_has_print_typography": css_has_print_typography,
        "js_has_export_btn": js_has_export_btn,
        "js_has_window_print": js_has_window_print,
        "js_has_title_swap": js_has_title_swap,
        "js_has_afterprint": js_has_afterprint,
    }


def check_dev_tooling():
    pkg_path = os.path.join(PROJECT_ROOT, "package.json")
    eslint_path = os.path.join(PROJECT_ROOT, "eslint.config.mjs")
    jsconfig_path = os.path.join(PROJECT_ROOT, "jsconfig.json")
    tests_dir = os.path.join(PROJECT_ROOT, "tests")

    has_package_json = os.path.isfile(pkg_path)
    has_eslint_config = os.path.isfile(eslint_path)
    has_jsconfig = os.path.isfile(jsconfig_path)
    has_tests_dir = os.path.isdir(tests_dir)

    dev_deps_only = False
    has_test_script = False
    has_lint_script = False
    if has_package_json:
        try:
            with open(pkg_path, "r", encoding="utf-8") as f:
                pkg = json.loads(f.read())
            dev_deps_only = "dependencies" not in pkg and "devDependencies" in pkg
            scripts = pkg.get("scripts", {})
            has_test_script = "test" in scripts
            has_lint_script = "lint" in scripts
        except (json.JSONDecodeError, IOError):
            pass

    has_test_files = False
    if has_tests_dir:
        for fname in os.listdir(tests_dir):
            if fname.endswith((".test.js", ".spec.js")):
                has_test_files = True
                break

    return {
        "has_package_json": has_package_json,
        "has_eslint_config": has_eslint_config,
        "has_jsconfig": has_jsconfig,
        "has_tests_dir": has_tests_dir,
        "dev_deps_only": dev_deps_only,
        "has_test_script": has_test_script,
        "has_lint_script": has_lint_script,
        "has_test_files": has_test_files,
    }


def check_observability(js):
    if js is None:
        return {
            "has_logger_object": False,
            "has_logger_info": False,
            "has_logger_warn": False,
            "has_logger_error": False,
            "has_window_onerror": False,
            "instrumentation_count": 0,
        }

    has_logger_object = "var logger" in js or "const logger" in js or "let logger" in js
    has_logger_info = "logger.info" in js
    has_logger_warn = "logger.warn" in js
    has_logger_error = "logger.error" in js
    has_window_onerror = "window.onerror" in js

    instrumentation_count = js.count("logger.info(") + js.count("logger.warn(") + js.count("logger.error(")

    return {
        "has_logger_object": has_logger_object,
        "has_logger_info": has_logger_info,
        "has_logger_warn": has_logger_warn,
        "has_logger_error": has_logger_error,
        "has_window_onerror": has_window_onerror,
        "instrumentation_count": instrumentation_count,
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
    rating_checks = check_rating_system(css, js)
    pdf_export_checks = check_pdf_export(css, js)
    dev_tooling_checks = check_dev_tooling()
    observability_checks = check_observability(js)

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

    rating_parts = list(rating_checks.values())
    rating_score = sum(rating_parts) / len(rating_parts) if rating_parts else 0

    pdf_export_parts = list(pdf_export_checks.values())
    pdf_export_score = sum(pdf_export_parts) / len(pdf_export_parts) if pdf_export_parts else 0

    dev_tooling_parts = list(dev_tooling_checks.values())
    dev_tooling_score = sum(dev_tooling_parts) / len(dev_tooling_parts) if dev_tooling_parts else 0

    obs_has_logger = 1.0 if observability_checks["has_logger_object"] else 0.0
    obs_has_info = 1.0 if observability_checks["has_logger_info"] else 0.0
    obs_has_warn = 1.0 if observability_checks["has_logger_warn"] else 0.0
    obs_has_error = 1.0 if observability_checks["has_logger_error"] else 0.0
    obs_has_onerror = 1.0 if observability_checks["has_window_onerror"] else 0.0
    obs_instrumentation = min(observability_checks["instrumentation_count"] / 8, 1.0)
    observability_score = (obs_has_logger + obs_has_info + obs_has_warn + obs_has_error + obs_has_onerror + obs_instrumentation) / 6

    composite = (
        (file_score * 0.06)
        + (html_score * 0.06)
        + (css_score * 0.06)
        + (js_score * 0.09)
        + (search_score * 0.09)
        + (filter_score * 0.06)
        + (detail_score * 0.09)
        + (dark_mode_score * 0.09)
        + (rating_score * 0.15)
        + (pdf_export_score * 0.08)
        + (dev_tooling_score * 0.09)
        + (observability_score * 0.08)
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
            "rating_system": {"score": round(rating_score, 4), "details": rating_checks},
            "pdf_export": {"score": round(pdf_export_score, 4), "details": pdf_export_checks},
            "dev_tooling": {"score": round(dev_tooling_score, 4), "details": dev_tooling_checks},
            "observability": {"score": round(observability_score, 4), "details": observability_checks},
        },
    }


if __name__ == "__main__":
    result = compute_score()
    print(json.dumps(result, indent=2))
