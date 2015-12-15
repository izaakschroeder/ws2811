
import levelup from 'levelup';
import leveldown from 'leveldown';

const db = levelup('/var/lib/ws2811/db', {
  keyEncoding: 'utf8',
  valueEncoding: 'json',
  db: leveldown,
});

export default db;
