document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            buildCalendar(data);
        })
        .catch(error => console.error('Fehler beim Laden der Daten:', error));
});

function buildCalendar(data) {
    const monthView = document.getElementById('month-view');
    monthView.innerHTML = ''; // Leeren
    data.weeks.forEach((week, index) => {
        const button = document.createElement('div');
        button.classList.add('week-button');
        button.textContent = `Woche ${index + 1} (${week.startDate} - ${week.endDate})`;
        button.onclick = () => showWeek(week);
        monthView.appendChild(button);
    });
}

function showWeek(week) {
    document.getElementById('calendar').style.display = 'none';
    const dayPlan = document.getElementById('day-plan');
    dayPlan.style.display = 'block';
    
    const dayDetails = document.getElementById('day-details');
    dayDetails.innerHTML = '<table><tr><th>Tag</th><th>Mittag (einfach, vorbereitbar)</th><th>Abend</th></tr>';
    
    week.days.forEach(day => {
        const row = `<tr>
            <td>${day.tag}</td>
            <td><a href="#" onclick="showRecipe('${day.mittag.id}')">${day.mittag.name}</a></td>
            <td><a href="#" onclick="showRecipe('${day.abend.id}')">${day.abend.name}</a></td>
        </tr>`;
        dayDetails.innerHTML += row;
    });
    dayDetails.innerHTML += '</table>';
    
    // Button für Einkaufsliste
    const shoppingButton = document.createElement('button');
    shoppingButton.textContent = 'Einkaufsliste anzeigen';
    shoppingButton.onclick = () => showShopping(week.shopping);
    dayDetails.appendChild(shoppingButton);
    
    document.getElementById('back-to-calendar').onclick = () => {
        dayPlan.style.display = 'none';
        document.getElementById('calendar').style.display = 'block';
    };
}

function showShopping(shopping) {
    document.getElementById('day-plan').style.display = 'none';
    const shoppingSection = document.getElementById('shopping-list');
    shoppingSection.style.display = 'block';
    
    const shoppingDetails = document.getElementById('shopping-details');
    shoppingDetails.innerHTML = '<ul>';
    let total = 0;
    shopping.items.forEach(item => {
        shoppingDetails.innerHTML += `<li>${item.name} (${item.menge}): ${item.preis} €</li>`;
        total += parseFloat(item.preis);
    });
    shoppingDetails.innerHTML += '</ul>';
    document.getElementById('total-cost').textContent = total.toFixed(2);
    
    document.getElementById('back-to-day').onclick = () => {
        shoppingSection.style.display = 'none';
        document.getElementById('day-plan').style.display = 'block';
    };
}

function showRecipe(recipeId) {
    // Hier Daten aus data.json laden und Rezept anzeigen
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const recipe = data.recipes.find(r => r.id === recipeId);
            if (recipe) {
                document.getElementById('day-plan').style.display = 'none';
                const recipesSection = document.getElementById('recipes');
                recipesSection.style.display = 'block';
                
                const recipeDetails = document.getElementById('recipe-details');
                recipeDetails.innerHTML = `
                    <h3>${recipe.name}</h3>
                    <p>Zutaten: ${recipe.zutaten.join(', ')}</p>
                    <p>Schritte: ${recipe.schritte}</p>
                    <p>Kalorien: ${recipe.kalorien} (abnehmfreundlich)</p>
                `;
                
                document.getElementById('back-to-day').onclick = () => {
                    recipesSection.style.display = 'none';
                    document.getElementById('day-plan').style.display = 'block';
                };
            }
        });
}
