var logger = {
    info: function (event, data) {
        console.log(JSON.stringify({ level: "info", event: event, data: data, ts: new Date().toISOString() }));
    },
    warn: function (event, data) {
        console.warn(JSON.stringify({ level: "warn", event: event, data: data, ts: new Date().toISOString() }));
    },
    error: function (event, data) {
        console.error(JSON.stringify({ level: "error", event: event, data: data, ts: new Date().toISOString() }));
    }
};

window.onerror = function (message, source, lineno, colno, error) {
    logger.error("uncaught_error", { message: message, source: source, lineno: lineno, colno: colno, stack: error && error.stack });
};

const recipes = [
    {
        id: 1,
        title: "Classic Pancakes",
        category: "Breakfast",
        image: "linear-gradient(135deg, #f6d365, #fda085)",
        ingredients: [
            "1½ cups all-purpose flour",
            "3½ tsp baking powder",
            "1 tbsp sugar",
            "¼ tsp salt",
            "1¼ cups milk",
            "1 egg",
            "3 tbsp melted butter"
        ],
        instructions: [
            "Sift flour, baking powder, sugar, and salt together in a large bowl.",
            "Make a well in the center and pour in milk, egg, and melted butter. Mix until smooth.",
            "Heat a lightly oiled griddle or pan over medium-high heat.",
            "Pour batter onto the griddle, using about ¼ cup for each pancake.",
            "Cook until bubbles form on the surface, then flip and cook until browned on the other side."
        ],
        prepTime: "20 min",
        servings: 4
    },
    {
        id: 2,
        title: "Caesar Salad",
        category: "Lunch",
        image: "linear-gradient(135deg, #a8e063, #56ab2f)",
        ingredients: [
            "1 large head romaine lettuce",
            "½ cup croutons",
            "¼ cup grated Parmesan",
            "2 tbsp olive oil",
            "1 tbsp lemon juice",
            "1 tsp Dijon mustard",
            "1 clove garlic, minced",
            "Salt and pepper to taste"
        ],
        instructions: [
            "Wash and chop the romaine lettuce into bite-sized pieces.",
            "Whisk together olive oil, lemon juice, Dijon mustard, and minced garlic for the dressing.",
            "Toss the lettuce with the dressing until evenly coated.",
            "Top with croutons and grated Parmesan.",
            "Season with salt and pepper to taste."
        ],
        prepTime: "15 min",
        servings: 2
    },
    {
        id: 3,
        title: "Spaghetti Bolognese",
        category: "Dinner",
        image: "linear-gradient(135deg, #eb3349, #f45c43)",
        ingredients: [
            "400g spaghetti",
            "500g ground beef",
            "1 onion, diced",
            "2 cloves garlic, minced",
            "400g canned crushed tomatoes",
            "2 tbsp tomato paste",
            "1 tsp dried oregano",
            "1 tsp dried basil",
            "Salt and pepper to taste",
            "Parmesan for serving"
        ],
        instructions: [
            "Cook spaghetti according to package directions. Drain and set aside.",
            "Brown ground beef in a large skillet over medium heat. Drain excess fat.",
            "Add diced onion and garlic, cook until softened.",
            "Stir in crushed tomatoes, tomato paste, oregano, and basil.",
            "Simmer for 20 minutes, stirring occasionally.",
            "Season with salt and pepper.",
            "Serve sauce over spaghetti and top with Parmesan."
        ],
        prepTime: "45 min",
        servings: 4
    },
    {
        id: 4,
        title: "Chocolate Lava Cake",
        category: "Dessert",
        image: "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)",
        ingredients: [
            "200g dark chocolate",
            "100g unsalted butter",
            "2 eggs",
            "2 egg yolks",
            "¼ cup sugar",
            "2 tbsp all-purpose flour",
            "Pinch of salt",
            "Butter and cocoa for ramekins"
        ],
        instructions: [
            "Preheat oven to 220°C (425°F). Butter and dust ramekins with cocoa powder.",
            "Melt chocolate and butter together in a double boiler. Let cool slightly.",
            "Whisk eggs, egg yolks, and sugar until thick and pale.",
            "Fold the chocolate mixture into the egg mixture.",
            "Sift in flour and salt, fold gently until combined.",
            "Divide batter among prepared ramekins.",
            "Bake for 12-14 minutes until edges are set but center jiggles.",
            "Let rest 1 minute, then invert onto plates and serve immediately."
        ],
        prepTime: "30 min",
        servings: 4
    },
    {
        id: 5,
        title: "Avocado Toast",
        category: "Breakfast",
        image: "linear-gradient(135deg, #56ab2f, #a8e063)",
        ingredients: [
            "2 slices sourdough bread",
            "1 ripe avocado",
            "1 tbsp lemon juice",
            "Red pepper flakes",
            "Salt and pepper to taste",
            "2 eggs (optional)"
        ],
        instructions: [
            "Toast the sourdough bread until golden and crispy.",
            "Halve the avocado, remove the pit, and scoop the flesh into a bowl.",
            "Mash the avocado with lemon juice, salt, and pepper.",
            "Spread the mashed avocado evenly on the toast.",
            "Sprinkle with red pepper flakes.",
            "Top with a fried or poached egg if desired."
        ],
        prepTime: "10 min",
        servings: 2
    },
    {
        id: 6,
        title: "Thai Green Curry",
        category: "Dinner",
        image: "linear-gradient(135deg, #11998e, #38ef7d)",
        ingredients: [
            "400ml coconut milk",
            "2 tbsp green curry paste",
            "300g chicken breast, sliced",
            "1 cup bamboo shoots",
            "1 red bell pepper, sliced",
            "1 cup Thai basil leaves",
            "2 tbsp fish sauce",
            "1 tbsp brown sugar",
            "Steamed jasmine rice for serving"
        ],
        instructions: [
            "Heat a splash of coconut milk in a wok over medium-high heat.",
            "Add curry paste and stir-fry for 1 minute until fragrant.",
            "Add chicken slices and cook until no longer pink on the outside.",
            "Pour in the remaining coconut milk and bring to a simmer.",
            "Add bamboo shoots, bell pepper, fish sauce, and sugar.",
            "Simmer for 10 minutes until chicken is cooked through.",
            "Stir in Thai basil leaves just before serving.",
            "Serve over steamed jasmine rice."
        ],
        prepTime: "35 min",
        servings: 3
    }
];

let activeCategory = "All";
let searchQuery = "";

function loadRatings() {
    try {
        return JSON.parse(localStorage.getItem("recipe-ratings")) || {};
    } catch (e) {
        logger.warn("localStorage_parse_error", { key: "recipe-ratings", error: e.message });
        return {};
    }
}

function saveRatings(ratings) {
    localStorage.setItem("recipe-ratings", JSON.stringify(ratings));
}

function loadRatedRecipes() {
    try {
        return JSON.parse(localStorage.getItem("rated-recipes")) || [];
    } catch (e) {
        logger.warn("localStorage_parse_error", { key: "rated-recipes", error: e.message });
        return [];
    }
}

function saveRatedRecipes(rated) {
    localStorage.setItem("rated-recipes", JSON.stringify(rated));
}

function loadReviews() {
    try {
        return JSON.parse(localStorage.getItem("recipe-reviews")) || {};
    } catch (e) {
        logger.warn("localStorage_parse_error", { key: "recipe-reviews", error: e.message });
        return {};
    }
}

function saveReviews(reviews) {
    localStorage.setItem("recipe-reviews", JSON.stringify(reviews));
}

function addRating(recipeId, value) {
    logger.info("add_rating", { recipeId: recipeId, value: value });
    var ratings = loadRatings();
    if (!ratings[recipeId]) {
        ratings[recipeId] = { ratings: [], average: 0 };
    }
    ratings[recipeId].ratings.push(value);
    var sum = ratings[recipeId].ratings.reduce(function (a, b) { return a + b; }, 0);
    ratings[recipeId].average = Math.round((sum / ratings[recipeId].ratings.length) * 10) / 10;
    saveRatings(ratings);

    var rated = loadRatedRecipes();
    if (rated.indexOf(recipeId) === -1) {
        rated.push(recipeId);
        saveRatedRecipes(rated);
    }
    return ratings[recipeId];
}

function addReview(recipeId, text) {
    logger.info("add_review", { recipeId: recipeId, length: text.length });
    var reviews = loadReviews();
    if (!reviews[recipeId]) {
        reviews[recipeId] = [];
    }
    reviews[recipeId].unshift({ text: text, date: new Date().toISOString() });
    saveReviews(reviews);
}

function getRatingData(recipeId) {
    var ratings = loadRatings();
    return ratings[recipeId] || { ratings: [], average: 0 };
}

function getReviews(recipeId) {
    var reviews = loadReviews();
    return (reviews[recipeId] || []).slice(0, 3);
}

function hasRated(recipeId) {
    var rated = loadRatedRecipes();
    return rated.indexOf(recipeId) !== -1;
}

function renderStarsText(average, max) {
    max = max || 5;
    var full = Math.round(average);
    var text = "";
    for (var i = 0; i < max; i++) {
        text += i < full ? "★" : "☆";
    }
    return text;
}

function getFilteredRecipes() {
    return recipes.filter(function (recipe) {
        const matchesCategory = activeCategory === "All" || recipe.category === activeCategory;
        if (!matchesCategory) return false;
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        if (recipe.title.toLowerCase().indexOf(q) !== -1) return true;
        return recipe.ingredients.some(function (ing) {
            return ing.toLowerCase().indexOf(q) !== -1;
        });
    });
}

function renderRecipeCard(recipe) {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.dataset.recipeId = recipe.id;
    var data = getRatingData(recipe.id);
    var starsText = renderStarsText(data.average);
    var count = data.ratings.length;
    card.innerHTML = `
        <div class="recipe-card-image" style="background: ${recipe.image}">
        </div>
        <div class="recipe-card-body">
            <h2 class="recipe-card-title">${recipe.title}</h2>
            <span class="recipe-card-category">${recipe.category}</span>
            <div class="card-rating">
                <span class="stars">${starsText}</span>
                <span class="rating-count">(${count})</span>
            </div>
            <div class="recipe-card-meta">
                <span>${recipe.prepTime}</span>
                <span>${recipe.servings} servings</span>
            </div>
        </div>
    `;
    card.addEventListener("click", function () {
        openModal(recipe);
    });
    return card;
}

function renderRecipes() {
    const grid = document.getElementById("recipe-grid");
    grid.innerHTML = "";
    const filtered = getFilteredRecipes();
    logger.info("render_recipes", { count: filtered.length, category: activeCategory, query: searchQuery });
    if (filtered.length === 0) {
        var msg = document.createElement("p");
        msg.className = "no-results";
        msg.textContent = "No recipes found.";
        grid.appendChild(msg);
        return;
    }
    filtered.forEach(function (recipe) {
        grid.appendChild(renderRecipeCard(recipe));
    });
}

function buildReviewsHTML(recipeId) {
    var reviews = getReviews(recipeId);
    if (reviews.length === 0) return "";
    var items = reviews.map(function (r) {
        return '<div class="review-item"><div class="review-text">' + r.text + '</div></div>';
    }).join("");
    return '<div class="recent-reviews"><h4>Recent Reviews</h4>' + items + '</div>';
}

function setupModalRating(recipe) {
    var container = document.getElementById("modal-star-rating");
    if (!container) return;
    var rated = hasRated(recipe.id);
    var data = getRatingData(recipe.id);

    if (rated) {
        container.classList.add("rated");
        var stars = container.querySelectorAll(".star");
        for (var i = 0; i < stars.length; i++) {
            if (parseInt(stars[i].getAttribute("data-value")) <= Math.round(data.average)) {
                stars[i].classList.add("active");
            }
        }
        return;
    }

    var stars = container.querySelectorAll(".star");

    container.addEventListener("mouseleave", function () {
        if (container.classList.contains("rated")) return;
        for (var i = 0; i < stars.length; i++) {
            stars[i].classList.remove("hover");
        }
    });

    for (var i = 0; i < stars.length; i++) {
        (function (star) {
            star.addEventListener("mouseenter", function () {
                if (container.classList.contains("rated")) return;
                var val = parseInt(star.getAttribute("data-value"));
                for (var j = 0; j < stars.length; j++) {
                    var sv = parseInt(stars[j].getAttribute("data-value"));
                    stars[j].classList.toggle("hover", sv <= val);
                }
            });

            star.addEventListener("click", function () {
                if (container.classList.contains("rated")) return;
                var val = parseInt(star.getAttribute("data-value"));
                addRating(recipe.id, val);
                container.classList.add("rated");
                for (var j = 0; j < stars.length; j++) {
                    stars[j].classList.remove("hover");
                    var sv = parseInt(stars[j].getAttribute("data-value"));
                    stars[j].classList.toggle("active", sv <= val);
                }
                var thanks = document.getElementById("rating-thanks");
                if (thanks) thanks.style.display = "block";

                var inputArea = document.getElementById("review-input-area");
                if (inputArea) inputArea.style.display = "block";

                var avgDisplay = document.getElementById("modal-average-display");
                if (avgDisplay) {
                    var updated = getRatingData(recipe.id);
                    avgDisplay.textContent = renderStarsText(updated.average) + " " + updated.average.toFixed(1) + " (" + updated.ratings.length + " ratings)";
                }
                renderRecipes();
            });
        })(stars[i]);
    }
}

function setupReviewInput(recipe) {
    var submitBtn = document.getElementById("review-submit");
    if (!submitBtn) return;
    submitBtn.addEventListener("click", function () {
        var textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById("review-text"));
        var text = textarea.value.trim();
        if (!text) return;
        addReview(recipe.id, text);
        textarea.value = "";
        var reviewsContainer = document.getElementById("modal-reviews");
        if (reviewsContainer) {
            reviewsContainer.innerHTML = buildReviewsHTML(recipe.id);
        }
    });
}

function openModal(recipe) {
    logger.info("open_modal", { recipeId: recipe.id, title: recipe.title });
    var backdrop = document.getElementById("modal-backdrop");
    var content = document.getElementById("modal-content");
    var data = getRatingData(recipe.id);
    var rated = hasRated(recipe.id);
    var avgText = data.ratings.length > 0
        ? renderStarsText(data.average) + " " + data.average.toFixed(1) + " (" + data.ratings.length + " ratings)"
        : "No ratings yet";

    var starsHTML = "";
    for (var i = 1; i <= 5; i++) {
        var cls = "star";
        if (rated && i <= Math.round(data.average)) cls += " active";
        starsHTML += '<span class="' + cls + '" data-value="' + i + '">★</span>';
    }

    content.innerHTML = `
        <div class="modal-image" style="background: ${recipe.image}"></div>
        <div class="modal-body">
            <h2 class="modal-title">${recipe.title}</h2>
            <div class="modal-meta">
                <span class="recipe-card-category">${recipe.category}</span>
                <span>${recipe.prepTime}</span>
                <span>${recipe.servings} servings</span>
            </div>
            <button class="export-pdf-btn" id="export-pdf-btn">🖨️ Export PDF</button>
            <div class="modal-rating">
                <div class="rating-label">Rate this recipe</div>
                <div class="star-rating${rated ? ' rated' : ''}" id="modal-star-rating">
                    ${starsHTML}
                </div>
                <div class="rating-thanks" id="rating-thanks" style="display:${rated ? 'block' : 'none'}">Thanks for rating!</div>
                <div class="average-display" id="modal-average-display">${avgText}</div>
                <div class="review-input-area" id="review-input-area" style="display:${rated ? 'block' : 'none'}">
                    <textarea id="review-text" placeholder="Write a review (optional)..." rows="2"></textarea>
                    <button id="review-submit">Submit Review</button>
                </div>
            </div>
            <div id="modal-reviews">${buildReviewsHTML(recipe.id)}</div>
            <h3 class="modal-section-title">Ingredients</h3>
            <ul class="modal-ingredients">
                ${recipe.ingredients.map(function (i) { return "<li>" + i + "</li>"; }).join("")}
            </ul>
            <h3 class="modal-section-title">Instructions</h3>
            <ol class="modal-instructions">
                ${recipe.instructions.map(function (s) { return "<li>" + s + "</li>"; }).join("")}
            </ol>
        </div>
    `;

    setupModalRating(recipe);
    setupReviewInput(recipe);

    var exportBtn = document.getElementById("export-pdf-btn");
    if (exportBtn) {
        exportBtn.addEventListener("click", function () {
            logger.info("pdf_export", { recipeId: recipe.id, title: recipe.title });
            var originalTitle = document.title;
            document.title = recipe.title;
            window.addEventListener("afterprint", function handler() {
                window.removeEventListener("afterprint", handler);
                document.title = originalTitle;
            });
            window.print();
        });
    }

    backdrop.hidden = false;
    requestAnimationFrame(function () {
        backdrop.classList.add("visible");
    });
    document.body.style.overflow = "hidden";
}

function closeModal() {
    logger.info("close_modal");
    var backdrop = document.getElementById("modal-backdrop");
    backdrop.classList.remove("visible");
    backdrop.addEventListener("transitionend", function handler() {
        backdrop.removeEventListener("transitionend", handler);
        backdrop.hidden = true;
        document.getElementById("modal-content").innerHTML = "";
    });
    document.body.style.overflow = "";
}

function getTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
}

function updateToggleButton() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var isDark = getTheme() === "dark";
    btn.textContent = isDark ? "☀️" : "🌙";
    btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function toggleTheme() {
    var newTheme = getTheme() === "dark" ? "light" : "dark";
    logger.info("toggle_theme", { from: getTheme(), to: newTheme });
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateToggleButton();
}

document.addEventListener("DOMContentLoaded", function () {
    updateToggleButton();

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

    renderRecipes();

    document.getElementById("search-input").addEventListener("input", function (e) {
        var input = /** @type {HTMLInputElement} */ (e.target);
        searchQuery = input.value.trim();
        renderRecipes();
    });

    document.getElementById("category-filters").addEventListener("click", function (e) {
        var target = /** @type {HTMLElement} */ (e.target);
        if (!target.matches(".filter-btn")) return;
        activeCategory = target.dataset.category;
        logger.info("filter_change", { category: activeCategory });
        document.querySelectorAll(".filter-btn").forEach(function (btn) {
            var b = /** @type {HTMLElement} */ (btn);
            b.classList.toggle("active", b.dataset.category === activeCategory);
        });
        renderRecipes();
    });

    document.getElementById("modal-backdrop").addEventListener("click", function (e) {
        if (e.target === this) closeModal();
    });

    document.getElementById("modal-close").addEventListener("click", closeModal);

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            var backdrop = document.getElementById("modal-backdrop");
            if (!backdrop.hidden) closeModal();
        }
    });
});

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        loadRatings, saveRatings, addRating, getRatingData, hasRated, getFilteredRecipes, recipes, logger,
        setActiveCategory: function (v) { activeCategory = v; },
        setSearchQuery: function (v) { searchQuery = v; }
    };
}
