import { useState, useEffect, useRef } from "react";
import * as htmlToImage from "html-to-image";

export default function App() {
  const [fishes, setFishes] = useState([]);
  const [newFish, setNewFish] = useState({ name: "", price: "" });
  const [keralaItems, setKeralaItems] = useState([]);
  const [newKerala, setNewKerala] = useState({ name: "", price: "" });
  const listRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // ---------------- FETCH FISHES ---------------- //
  const fetchFishes = async () => {
    try {
      const res = await fetch(`${API_URL}/fishes`);
      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        return;
      }
      const data = await res.json();
      setFishes(data.map(f => ({ ...f, selected: true })));
    } catch (err) {
      console.error("Failed to fetch fishes:", err);
    }
  };

  useEffect(() => {
    fetchFishes();
  }, []);

  // ---------------- ADD NEW FISH ---------------- //
  const addFish = async () => {
    if (!newFish.name || !newFish.price) return;
    try {
      const res = await fetch(`${API_URL}/fishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFish.name, price: Number(newFish.price) }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        return;
      }
      const addedFish = await res.json();
      setFishes([...fishes, { ...addedFish, selected: true }]);
      setNewFish({ name: "", price: "" });
    } catch (err) {
      console.error("Error adding fish:", err);
    }
  };

  // ---------------- DELETE FISH ---------------- //
  const deleteFish = async (id) => {
    if (!confirm("Are you sure you want to delete this fish?")) return;
    try {
      const res = await fetch(`${API_URL}/fishes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        return;
      }
      setFishes(fishes.filter(f => f.id !== id));
    } catch (err) {
      console.error("Error deleting fish:", err);
    }
  };

  // ---------------- TOGGLE SELECTION ---------------- //
  const toggleSelect = id =>
    setFishes(prev => prev.map(f => (f.id === id ? { ...f, selected: !f.selected } : f)));

  // ---------------- UPDATE PRICE ---------------- //
  const updatePrice = async (id, price) => {
    if (!id || price === "") return;
    setFishes(prev => prev.map(f => (f.id === id ? { ...f, price: Number(price) } : f)));
    try {
      const res = await fetch(`${API_URL}/fishes/${id}/price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: Number(price) }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
      }
    } catch (err) {
      console.error("Failed to update price:", err);
    }
  };

  // ---------------- SHARE IMAGE ---------------- //
  const shareToWhatsApp = async () => {
    if (!listRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(listRef.current, { quality: 1, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "fish_list.png", { type: blob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Today's Fish Prices 🐟",
          text: "Fresh catch for today!",
        });
      } else {
        const link = document.createElement("a");
        link.download = "fish_list.png";
        link.href = dataUrl;
        link.click();
        alert("Image downloaded! You can now share it on WhatsApp.");
      }
    } catch (err) {
      console.error("Error sharing image:", err);
    }
  };

  // ---------------- RENDER ---------------- //
  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-2 text-blue-700">🐟 GRL Fish & Kerala Store</h1>
      <p className="text-center text-md font-semibold text-green-700 mb-6 -mt-1">
        🏠 Home Delivery: <span className="font-bold">7306698782</span>
      </p>

      {/* Add new fish */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Fish name"
          className="border p-2 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newFish.name}
          onChange={e => setNewFish({ ...newFish, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price ₹"
          className="border p-2 rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newFish.price}
          onChange={e => setNewFish({ ...newFish, price: e.target.value })}
        />
        <button className="bg-green-500 text-white rounded px-3 hover:bg-green-600" onClick={addFish}>
          ➕
        </button>
      </div>

      {/* Fish List */}
      <div className="space-y-3">
        {fishes.map(f => (
          <div
            key={f.id}
            className={`flex items-center justify-between p-2 rounded border ${
              f.selected ? "bg-green-100" : "bg-white"
            }`}
          >
            <div>
              <p className="font-semibold text-gray-800">{f.name}</p>
              <p className="text-sm text-gray-500">₹{f.price}/kg</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border rounded w-20 p-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={f.price ?? ""}
                onChange={e => updatePrice(f.id, e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600"
                onClick={() => toggleSelect(f.id)}
              >
                {f.selected ? "✅" : "➕"}
              </button>
              <button
                className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                onClick={() => deleteFish(f.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shareable Poster */}
      <div
        ref={listRef}
        className="mt-6 bg-gradient-to-b from-blue-100 to-white p-4 rounded-3xl shadow-xl border border-blue-300 text-center"
        style={{ width: "100%", maxWidth: 400 }}
      >
        <h2 className="text-2xl font-bold text-blue-800 mb-1">🐠 GRL Fish & Kerala Store</h2>
        <p className="text-md text-green-700 font-semibold mb-4">Home Delivery: 7306698782</p>

        <div className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-2xl mb-4 shadow-md">
          <h3 className="text-lg font-bold">Today's Fish List</h3>
        </div>

        {fishes.filter(f => f.selected).length === 0 ? (
          <p className="text-gray-500 italic">No fish selected</p>
        ) : (
          <div className="space-y-2 mb-6">
            {fishes
              .filter(f => f.selected)
              .map((f, idx) => (
                <div
                  key={f.id}
                  className={`flex justify-between p-2 rounded-lg ${
                    idx % 2 === 0 ? "bg-blue-50" : "bg-white"
                  } shadow-sm`}
                >
                  <span className="font-semibold text-gray-800">{f.name}</span>
                  <span className="font-medium text-gray-700">₹{f.price}/kg</span>
                </div>
              ))}
          </div>
        )}

        {/* Kerala items placeholder */}
        <div className="flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-2xl mb-4 shadow-md">
          <h3 className="text-lg font-bold">Kerala Items</h3>
        </div>
        <p className="text-gray-500 italic">Coming soon...</p>

        <p className="text-xs text-gray-500 mt-4 italic">
          Updated on {new Date().toLocaleDateString()} | Fresh catch daily 🐟
        </p>
      </div>

      <button
        className="bg-green-600 text-white w-full mt-4 p-3 rounded-xl text-lg font-bold hover:bg-green-700"
        onClick={shareToWhatsApp}
      >
        Share to WhatsApp 📸
      </button>
    </div>
  );
}
