CREATE TABLE batteries (
  id SERIAL PRIMARY KEY,
  location VARCHAR(255),
  capacity INT,
  chargeLevel INT,
  healthStatus VARCHAR(50)
);
