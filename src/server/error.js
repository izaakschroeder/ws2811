
/* eslint no-unused-vars: 0 */
export default function error(err, req, res, next) {
  if (err.status) {
    res.status(err.status);
  }
  res.send(err);
}
