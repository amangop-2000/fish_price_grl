-- ==========================================
-- Fish Price Tracker Database
-- ==========================================

-- Fish table
CREATE TABLE fishes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    price NUMERIC(10,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fish price history
CREATE TABLE fish_price_history (
    id SERIAL PRIMARY KEY,
    fish_id INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_fish
        FOREIGN KEY (fish_id)
        REFERENCES fishes(id)
        ON DELETE CASCADE
);

-- Kerala items
CREATE TABLE kerala_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    price NUMERIC(10,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kerala item price history
CREATE TABLE kerala_item_price_history (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_kerala_item
        FOREIGN KEY (item_id)
        REFERENCES kerala_items(id)
        ON DELETE CASCADE
);

-- Useful indexes
CREATE INDEX idx_fish_price_history_fish_id
ON fish_price_history(fish_id);

CREATE INDEX idx_kerala_item_price_history_item_id
ON kerala_item_price_history(item_id);

CREATE INDEX idx_fishes_updated_at
ON fishes(updated_at);

CREATE INDEX idx_kerala_items_updated_at
ON kerala_items(updated_at);