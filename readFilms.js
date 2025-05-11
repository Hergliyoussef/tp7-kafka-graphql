const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'film.json');

if (!fs.existsSync(file)) {
  console.log('❌ Aucun fichier film.json trouvé.');
  process.exit();
}

const data = fs.readFileSync(file, 'utf8');
const films = JSON.parse(data);

console.log('🎞️ Films enregistrés :');
films.forEach(film => {
  console.log(`- ${film.id} : ${film.title} (${film.description})`);
});

// Exemple de recherche
const searchId = '3';
const found = films.find(f => f.id === searchId);
console.log('\n🔍 Résultat de recherche :', found || 'Aucun film trouvé');
