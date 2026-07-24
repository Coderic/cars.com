CREATE TABLE IF NOT EXISTS vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  body_type TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  images TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON vehicles(featured);
CREATE INDEX IF NOT EXISTS idx_vehicles_make ON vehicles(make);

CREATE TRIGGER IF NOT EXISTS vehicles_updated_at
AFTER UPDATE ON vehicles
BEGIN
  UPDATE vehicles SET updated_at = datetime('now') WHERE id = NEW.id;
END;
