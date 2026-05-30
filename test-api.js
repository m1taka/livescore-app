const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const today = new Date();
console.log('Today:', formatDate(today));
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
console.log('Tomorrow:', formatDate(tomorrow));

// Test API call for tomorrow's matches
fetch('https://www.thesportsdb.com/api/v1/json/123/eventsday.php?d=' + formatDate(tomorrow) + '&s=Soccer')
  .then(r => r.json())
  .then(data => {
    console.log('\nAPI Response for tomorrow:');
    if (data.events) {
      console.log('Total matches:', data.events.length);
      const championsLeague = data.events.filter(m => m.strLeague && (m.strLeague.includes('Champions') || m.idLeague === '4480'));
      console.log('Champions League matches:', championsLeague.length);
      if (championsLeague.length > 0) {
        championsLeague.forEach(m => console.log('-', m.strEvent, '|', m.strLeague));
      } else {
        console.log('\nNo Champions League matches found');
        console.log('\nAvailable leagues in response:');
        const leagues = [...new Set(data.events.map(m => m.strLeague))].slice(0, 15);
        leagues.forEach(l => console.log('-', l));
      }
    } else {
      console.log('No events returned for tomorrow');
      console.log('API response:', JSON.stringify(data, null, 2));
    }
  })
  .catch(err => console.error('Error:', err.message));
