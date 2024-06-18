CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  battery_id INT REFERENCES batteries(id),
  user_id INT REFERENCES users(id),
  date TIMESTAMPTZ NOT NULL,
  energy_output FLOAT NOT NULL,
  revenue FLOAT NOT NULL
);
