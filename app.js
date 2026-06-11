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
    card.innerHTML = `
        <div class="recipe-card-image" style="background: ${recipe.image}">
        </div>
        <div class="recipe-card-body">
            <h2 class="recipe-card-title">${recipe.title}</h2>
            <span class="recipe-card-category">${recipe.category}</span>
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

function openModal(recipe) {
    var backdrop = document.getElementById("modal-backdrop");
    var content = document.getElementById("modal-content");
    content.innerHTML = `
        <div class="modal-image" style="background: ${recipe.image}"></div>
        <div class="modal-body">
            <h2 class="modal-title">${recipe.title}</h2>
            <div class="modal-meta">
                <span class="recipe-card-category">${recipe.category}</span>
                <span>${recipe.prepTime}</span>
                <span>${recipe.servings} servings</span>
            </div>
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
    backdrop.hidden = false;
    requestAnimationFrame(function () {
        backdrop.classList.add("visible");
    });
    document.body.style.overflow = "hidden";
}

function closeModal() {
    var backdrop = document.getElementById("modal-backdrop");
    backdrop.classList.remove("visible");
    backdrop.addEventListener("transitionend", function handler() {
        backdrop.removeEventListener("transitionend", handler);
        backdrop.hidden = true;
        document.getElementById("modal-content").innerHTML = "";
    });
    document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", function () {
    renderRecipes();

    document.getElementById("search-input").addEventListener("input", function (e) {
        searchQuery = e.target.value.trim();
        renderRecipes();
    });

    document.getElementById("category-filters").addEventListener("click", function (e) {
        if (!e.target.matches(".filter-btn")) return;
        activeCategory = e.target.dataset.category;
        document.querySelectorAll(".filter-btn").forEach(function (btn) {
            btn.classList.toggle("active", btn.dataset.category === activeCategory);
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
