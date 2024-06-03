// Code to display the standings table 

// General settings for API access
const apiKey = '1e2ed6f46emshbd5766d6fa68ce8p17bd3djsnb21a130204a1';
const apiHost = 'api-nba-v1.p.rapidapi.com';

// Function to fetch standings based on conference
async function fetchStandings(conference) {
    let url = '';
    switch (conference) {
        case 'west':
            url = 'https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2023&conference=west';
            break;
        case 'east':
            url = 'https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2023&conference=east';
            break;
    }

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost
        }
    };
    const standingsBody = document.getElementById('standings-body');
    const conferenceTitle = document.getElementById('conference-title');
    standingsBody.innerHTML = ''; // Clear previous data
    conferenceTitle.innerText = `NBA ${conference.charAt(0).toUpperCase() + conference.slice(1)} Conference Table`; // Update the title

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (data.results && data.results > 0) {
            const sortedTeams = data.response.sort((a, b) => a.conference.rank - b.conference.rank);
            sortedTeams.forEach((teamData) => {
                const teamRow = document.createElement('tr');
                teamRow.innerHTML = `
                    <td>${teamData.conference.rank}</td>
                    <td>${teamData.team.name}</td>
                    <td><img src="${teamData.team.logo}" alt="Logo" style="max-width: 30px; max-height: 30px;"></td>
                    <td>${teamData.win.total}</td>
                    <td>${teamData.win.percentage}</td>
                    <td>${teamData.loss.total}</td>
                    <td>${teamData.streak}${teamData.winStreak ? 'W' : 'L'}</td>
                `;
                standingsBody.appendChild(teamRow);
            });
        } else {
            console.log('No data found');
        }
    } catch (error) {
        console.error('Failed to fetch standings:', error);
    }
}

// Initially load West Conference standings
fetchStandings('west');



// Code to display the stats

document.addEventListener("DOMContentLoaded", function() {
    // Add click event listeners to each button in the menu bar
    const buttons = document.querySelectorAll('.menu-bar button');
    buttons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        buttons.forEach(b => b.classList.remove('active'));
        // Add active class to the clicked button
        this.classList.add('active');
  
        // Load the appropriate data
        if (this.id === 'loadScorers') {
          loadTopScorers();
        } else if (this.id === 'loadAssists') {
          loadTopAssisters();
        } else if (this.id === 'loadRebounds') {
          loadTopRebounders();
        }
      });
    });
  
    // Initially load top scorers data
    loadTopScorers();
  });
  
  function loadTopScorers() {
    fetchData('https://nba-stats-db.herokuapp.com/api/playerdata/topscorers/total/season/2023/', [
      'Field Goals', 'Field Goal Percent', 'Points'
    ], ['field_goals', 'field_percent', 'PTS']);
  }
  
  function loadTopAssisters() {
    fetchData('https://nba-stats-db.herokuapp.com/api/top_assists/totals/2023/', [
      'Assists', 'Steals', 'Blocks'
    ], ['AST', 'STL', 'BLK']);
  }
  
  function loadTopRebounders() {
    fetchData('https://nba-stats-db.herokuapp.com/api/top_rebounds/totals/2023/', [
      'Offensive Rebounds', 'Defensive Rebounds', 'Total Rebounds'
    ], ['ORB', 'DRB', 'TRB']);
  }
  
  function fetchData(url, headerTitles, dataFields) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        populateTable(data.results, headerTitles, dataFields);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }
  
  function populateTable(data, headerTitles, dataFields) {
    const tableHead = document.getElementById('playersTable').getElementsByTagName('thead')[0];
    const tableBody = document.getElementById('playersTable').getElementsByTagName('tbody')[0];
    // Set headers
    headerTitles.forEach((title, index) => {
      tableHead.rows[0].cells[index + 4].textContent = title;
    });
    // Clear existing data
    tableBody.innerHTML = '';
    // Populate with new data
    data.forEach(player => {
      let row = tableBody.insertRow();
      row.insertCell(0).textContent = player.player_name;
      row.insertCell(1).textContent = player.age;
      row.insertCell(2).textContent = player.team;
      row.insertCell(3).textContent = player.games_started;
      dataFields.forEach((field, index) => {
        row.insertCell(index + 4).textContent = player[field];
      });
    });
  }
  

  // Code for matches.html

  const url = 'https://api-basketball.p.rapidapi.com/games?season=2023-2024&league=12';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '1e2ed6f46emshbd5766d6fa68ce8p17bd3djsnb21a130204a1',
		'X-RapidAPI-Host': 'api-basketball.p.rapidapi.com'
	}
};


fetch(url, options)
    .then(response => response.json())
    .then(data => {
        const fixtures = data.response;
        const fixtureList = document.getElementById('fixture-list');

        fixtures.forEach((fixture) => {
            const listItem = document.createElement('li');
            listItem.className = 'fixture-item';

            const homeTeamImage = document.createElement('img');
            homeTeamImage.src = fixture.teams.home.logo;
            homeTeamImage.alt = fixture.teams.home.name;
            homeTeamImage.className = 'team-image';

            const homeTeamDiv = document.createElement('div');
            homeTeamDiv.className = 'home-team';
            homeTeamDiv.appendChild(homeTeamImage);
            homeTeamDiv.innerHTML += ` ${fixture.teams.home.name}`;

            const vsText = document.createElement('span');
            vsText.textContent = 'vs';
            vsText.className = 'vs-text';

            const awayTeamImage = document.createElement('img');
            awayTeamImage.src = fixture.teams.away.logo;
            awayTeamImage.alt = fixture.teams.away.name;
            awayTeamImage.className = 'team-image';

            const awayTeamDiv = document.createElement('div');
            awayTeamDiv.className = 'away-team';
            awayTeamDiv.innerHTML += ` ${fixture.teams.away.name}`;
            awayTeamDiv.appendChild(awayTeamImage);

            listItem.appendChild(homeTeamDiv);
            listItem.appendChild(vsText);
            listItem.appendChild(awayTeamDiv);

            fixtureList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Failed to fetch NBA fixtures:', error);
    });


    // Code for news.html

    document.addEventListener('DOMContentLoaded', function() {
      const newsList = document.getElementById('news-list');
  
      async function fetchNews() {
          try {
              const response = await fetch('https://nba-latest-news.p.rapidapi.com/articles', {
                  method: 'GET',
                  headers: {
                      'X-RapidAPI-Key': '1e2ed6f46emshbd5766d6fa68ce8p17bd3djsnb21a130204a1',
      'X-RapidAPI-Host': 'nba-latest-news.p.rapidapi.com'
                  },
              });
  
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
  
              const data = await response.json();
  
              newsList.innerHTML = ''; // Clear existing content
  
              data.forEach((item) => {
                  const newsItem = document.createElement('div');
                  newsItem.classList.add('news-item');
  
                  const textWrapper = document.createElement('div');
                  textWrapper.classList.add('news-text');
  
                  const headline = document.createElement('h2');
                  const link = document.createElement('a');
                  link.href = item.url;
                  link.textContent = item.title;
                  link.classList.add('news-link');
                  link.target = '_blank';
  
                  const source = document.createElement('p');
                  source.textContent = `Source: ${item.source}`;
                  source.classList.add('news-source');
  
                  headline.appendChild(link);
                  textWrapper.appendChild(headline);
                  textWrapper.appendChild(source);
  
                  newsItem.appendChild(textWrapper);
  
                  newsList.appendChild(newsItem);
              });
          } catch (error) {
              console.error('Failed to fetch news:', error);
              newsList.innerHTML = '<p>Failed to load news. Please try again later.</p>';
          }
      }
  
      fetchNews();
  });
  