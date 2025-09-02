document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            buildCalendar(data);
            buildShoppingLists(data);
            buildRecipes(data);
            openTab('calendar'); // Standard-Tab beim Laden
        })
        .catch(error => console.error('Fehler beim Laden der Daten:', error));
});

function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab-button[onclick="openTab('${tabName}')"]`).classList.add('active');
}

function buildCalendar(data) {
    const monthView = document.getElementById('month-view');
    monthView.innerHTML = '';
    data.weeks.forEach((week, index) => {
        const button = document.createElement('div');
        button.classList.add('week-button');
        button.textContent = `Woche ${index + 1} (${week.startDate} - ${week.endDate})`;
        button.onclick = () => showWeekDetails(week);
        monthView.appendChild(button);
    });
}

function showWeekDetails(week) {
    // Hier könnte man eine detaillierte Woche anzeigen, z.B. in einem Modal oder separaten Bereich
    alert(`Details für Woche ${week.startDate} - ${week.endDate}`);
}

function buildShoppingLists(data) {
    const shoppingDetails = document.getElementById('shopping-details');
    shoppingDetails.innerHTML = '<h3>Einkaufslisten nach Woche</h3>';
    data.weeks.forEach((week, index) => {
        const weekSection = document.createElement('div');
        weekSection.innerHTML = `<h4>Woche ${index + 1} (${week.startDate} - ${week.endDate})</h4><ul>`;
        let total = 0;
        week.shopping.items.forEach(item => {
            weekSection.innerHTML += `<li>${item.name} (${item.menge}): ${item.preis} €</li>`;
            total += parseFloat(item.preis);
        });
        weekSection.innerHTML += `</ul><p>Gesamtkosten: ${total.toFixed(2)} €</p>`;
        shoppingDetails.appendChild(weekSection);
    });
}

function buildRecipes(data) {
    const recipeDetails = document.getElementById('recipe-details');
    recipeDetails.innerHTML = '<h3>Rezepte nach Tag</h3>';
    const recipesByDay = {};

    data.weeks.forEach(week => {
        week.days.forEach(day => {
            if (!recipesByDay[day.tag]) recipesByDay[day.tag] = [];
            recipesByDay[day.tag].push(day.mittag);
            recipesByDay[day.tag].push(day.abend);
        });
    });

    for (const [day, recipes] of Object.entries(recipesByDay)) {
        const category = document.createElement('div');
        category.classList.add('recipe-category');
        category.innerHTML = `<h3>${day}</h3>`;
        const recipeList = document.createElement('div');
        recipes.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.classList.add('recipe-item');
            recipeItem.innerHTML = `<strong>${recipe.name}</strong> (Kalorien: ${data.recipes.find(r => r.id === recipe.id).kalorien})`;
            recipeItem.onclick = () => showRecipeDetails(recipe.id);
            recipeList.appendChild(recipeItem);
        });
        category.appendChild(recipeList);
        recipeDetails.appendChild(category);
    }
}

function showRecipeDetails(recipeId) {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const recipe = data.recipes.find(r => r.id === recipeId);
            if (recipe) {
                openTab('recipes');
                const recipeDetails = document.getElementById('recipe-details');
                recipeDetails.innerHTML = `
                    <div class="recipe-details">
                        <h3>${recipe.name}</h3>
                        <p>Zutaten: ${recipe.zutaten.join(', ')}</p>
                        <p>Schritte: ${recipe.schritte}</p>
                        <p>Kalorien: ${recipe.kalorien} (abnehmfreundlich)</p>
                    </div>
                `;
            }
        });
}
