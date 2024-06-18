CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  severity VARCHAR(50) NOT NULL,
  battery_id INT REFERENCES batteries(id),
  description TEXT
);
