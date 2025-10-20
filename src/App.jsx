import { useState, useEffect, useRef } from "react";
import * as htmlToImage from "html-to-image";

export default function App() {
  const [fishes, setFishes] = useState([]);
  const [newFish, setNewFish] = useState({ name: "", price: "" });
  const [keralaItems, setKeralaItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
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

  // ---------------- FETCH KERALA ITEMS ---------------- //
  const fetchKeralaItems = async () => {
    try {
      const res = await fetch(`${API_URL}/kerala_items`);
      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        return;
      }
      const data = await res.json();
      setKeralaItems(data.map(i => ({ ...i, selected: true })));
    } catch (err) {
      console.error("Failed to fetch Kerala items:", err);
    }
  };

  useEffect(() => {
    fetchFishes();
    fetchKeralaItems();
  }, []);

  // ---------------- ADD FISH ---------------- //
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

  // ---------------- ADD KERALA ITEM ---------------- //
  const addKeralaItem = async () => {
    if (!newItem.name || !newItem.price) return;
    try {
      const res = await fetch(`${API_URL}/kerala_items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItem.name, price: Number(newItem.price) }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        return;
      }

      const addedItem = await res.json();
      setKeralaItems([...keralaItems, { ...addedItem, selected: true }]);
      setNewItem({ name: "", price: "" });
    } catch (err) {
      console.error("Error adding Kerala item:", err);
    }
  };

  // ---------------- TOGGLE & UPDATE ---------------- //
  const toggleSelect = (listSetter, list, id) =>
    listSetter(list.map(i => (i.id === id ? { ...i, selected: !i.selected } : i)));

  const updatePrice = async (type, id, price) => {
    if (!id || price === "") return;
    const setter = type === "fish" ? setFishes : setKeralaItems;
    const list = type === "fish" ? fishes : keralaItems;
    setter(list.map(i => (i.id === id ? { ...i, price: Number(price) } : i)));

    try {
      const res = await fetch(`${API_URL}/${type === "fish" ? "fishes" : "kerala_items"}/${id}/price`, {
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

  // ---------------- SHARE ---------------- //
  const shareToWhatsApp = async () => {
    if (!listRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(listRef.current, { quality: 1, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "fish_list.png", { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "GRL Fish & Kerala Store 🐟",
          text: "Today's prices and Kerala items list!",
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
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">🐟 GRL Fish & Kerala Store</h1>

      {/* Add Fish */}
      <h2 className="text-lg font-semibold mb-2 text-blue-600">Add Fish</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Fish name"
          className="border p-2 rounded w-1/2"
          value={newFish.name}
          onChange={e => setNewFish({ ...newFish, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price ₹"
          className="border p-2 rounded w-1/3"
          value={newFish.price}
          onChange={e => setNewFish({ ...newFish, price: e.target.value })}
        />
        <button className="bg-green-500 text-white rounded px-3" onClick={addFish}>
          ➕
        </button>
      </div>

      {/* Add Kerala Item */}
      <h2 className="text-lg font-semibold mb-2 text-orange-600">Add Kerala Item</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Item name"
          className="border p-2 rounded w-1/2"
          value={newItem.name}
          onChange={e => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price ₹"
          className="border p-2 rounded w-1/3"
          value={newItem.price}
          onChange={e => setNewItem({ ...newItem, price: e.target.value })}
        />
        <button className="bg-orange-500 text-white rounded px-3" onClick={addKeralaItem}>
          ➕
        </button>
      </div>

      {/* Fish List */}
      <div className="space-y-3 mb-6">
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
                className="border rounded w-20 p-1"
                value={f.price ?? ""}
                onChange={e => updatePrice("fish", f.id, e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-2 rounded"
                onClick={() => toggleSelect(setFishes, fishes, f.id)}
              >
                {f.selected ? "✅" : "➕"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Kerala Items List */}
      <div className="space-y-3 mb-6">
        {keralaItems.map(i => (
          <div
            key={i.id}
            className={`flex items-center justify-between p-2 rounded border ${
              i.selected ? "bg-yellow-100" : "bg-white"
            }`}
          >
            <div>
              <p className="font-semibold text-gray-800">{i.name}</p>
              <p className="text-sm text-gray-500">₹{i.price}/pkt</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border rounded w-20 p-1"
                value={i.price ?? ""}
                onChange={e => updatePrice("item", i.id, e.target.value)}
              />
              <button
                className="bg-orange-500 text-white px-2 rounded"
                onClick={() => toggleSelect(setKeralaItems, keralaItems, i.id)}
              >
                {i.selected ? "✅" : "➕"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Poster */}
      <div
        ref={listRef}
        className="mt-6 bg-gradient-to-b from-blue-100 to-white p-4 rounded-3xl shadow-xl border border-blue-300 text-center"
        style={{ width: "100%", maxWidth: 400 }}
      >
        <h1 className="text-2xl font-extrabold text-blue-800 mb-4">
          GRL Fish & Kerala Store
        </h1>

        {/* Fish Section */}
        <div className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-2xl mb-4 shadow-md">
          <span className="text-2xl">🐠</span>
          <h2 className="text-xl font-bold">Today's Fish List</h2>
        </div>

        {fishes.filter(f => f.selected).map((f, idx) => (
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

        {/* Kerala Items Section */}
        <div className="flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-2xl mt-6 mb-4 shadow-md">
          <span className="text-2xl">🥥</span>
          <h2 className="text-xl font-bold">Kerala Items</h2>
        </div>

        {keralaItems.filter(i => i.selected).map((i, idx) => (
          <div
            key={i.id}
            className={`flex justify-between p-2 rounded-lg ${
              idx % 2 === 0 ? "bg-orange-50" : "bg-white"
            } shadow-sm`}
          >
            <span className="font-semibold text-gray-800">{i.name}</span>
            <span className="font-medium text-gray-700">₹{i.price}</span>
          </div>
        ))}

        <p className="text-xs text-gray-500 mt-4 italic">
          Updated on {new Date().toLocaleDateString()} | Fresh catch & Kerala taste 🌴
        </p>
      </div>

      <button
        className="bg-green-600 text-white w-full mt-4 p-3 rounded-xl text-lg font-bold"
        onClick={shareToWhatsApp}
      >
        Share to WhatsApp 📸
      </button>
    </div>
  );
}
