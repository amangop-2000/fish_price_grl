import { useState, useEffect, useRef } from "react";
import * as htmlToImage from "html-to-image";

/* =========================================================
   DESIGN SYSTEM
========================================================= */

const colors = {
  navy: "#123D70",
  navyDark: "#0B2C52",
  navySoft: "#EAF2FB",
  green: "#2F7D32",
  greenSoft: "#EAF6EA",
  gold: "#C39A45",
  goldSoft: "#FBF6EA",
  text: "#172B43",
  muted: "#66758A",
  border: "#D7E0EA",
  white: "#FFFFFF",
  danger: "#D64545",
};

const tableHeaderStyle = {
  background: colors.navy,
  color: colors.white,
  border: `1px solid #8FA1B5`,
  padding: "7px 6px",
  fontSize: "13px",
  fontWeight: 900,
  textAlign: "center",
  whiteSpace: "nowrap",
  letterSpacing: "0.3px",
};

const greenHeaderStyle = {
  ...tableHeaderStyle,
  background: colors.green,
};

const tableCellStyle = {
  border: `1px solid #C9D3DF`,
  padding: "5px 7px",
  fontSize: "13px",
  lineHeight: 1.15,
  verticalAlign: "middle",
  background: "#FFFFFF",
};

const tableCellCenterStyle = {
  ...tableCellStyle,
  textAlign: "center",
  width: "12%",
  color: "#53657A",
  fontWeight: 700,
};

const tableCellRightStyle = {
  ...tableCellStyle,
  textAlign: "right",
  fontWeight: 900,
  whiteSpace: "nowrap",
  width: "29%",
  color: colors.navyDark,
};

const fishTableCellStyle = {
  ...tableCellStyle,
  fontWeight: 700,
  width: "59%",
  color: colors.text,
};

const itemTableCellStyle = {
  ...tableCellStyle,
  fontWeight: 700,
  width: "55%",
  color: colors.text,
};

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [fishes, setFishes] = useState([]);
  const [newFish, setNewFish] = useState({
    name: "",
    price: "",
  });

  const [keralaItems, setKeralaItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
  });

  const [priceInputs, setPriceInputs] = useState({});
  const [isSharing, setIsSharing] = useState(false);

  const listRef = useRef(null);

  const API_URL = "/api";

  /* =========================================================
     FETCH FISHES
  ========================================================= */

  const fetchFishes = async () => {
    try {
      const res = await fetch(`${API_URL}/fishes`);

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        return;
      }

      const data = await res.json();

      setFishes(
        data.map((f) => ({
          ...f,
          selected: true,
        }))
      );

      setPriceInputs((prev) => {
        const next = { ...prev };

        data.forEach((f) => {
          next[`fish-${f.id}`] = String(f.price ?? "");
        });

        return next;
      });
    } catch (err) {
      console.error("Failed to fetch fishes:", err);
    }
  };

  /* =========================================================
     FETCH KERALA ITEMS
  ========================================================= */

  const fetchKeralaItems = async () => {
    try {
      const res = await fetch(`${API_URL}/kerala_items`);

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        return;
      }

      const data = await res.json();

      setKeralaItems(
        data.map((i) => ({
          ...i,
          selected: true,
        }))
      );

      setPriceInputs((prev) => {
        const next = { ...prev };

        data.forEach((i) => {
          next[`item-${i.id}`] = String(i.price ?? "");
        });

        return next;
      });
    } catch (err) {
      console.error("Failed to fetch Kerala items:", err);
    }
  };

  useEffect(() => {
    fetchFishes();
    fetchKeralaItems();
  }, []);

  /* =========================================================
     ADD FISH
  ========================================================= */

  const addFish = async () => {
    if (!newFish.name.trim() || newFish.price === "") return;

    const numericPrice = Number(newFish.price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) return;

    try {
      const res = await fetch(`${API_URL}/fishes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newFish.name.trim(),
          price: numericPrice,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        return;
      }

      const addedFish = await res.json();

      setFishes((prev) => [
        ...prev,
        {
          ...addedFish,
          selected: true,
        },
      ]);

      setPriceInputs((prev) => ({
        ...prev,
        [`fish-${addedFish.id}`]: String(
          addedFish.price ?? ""
        ),
      }));

      setNewFish({
        name: "",
        price: "",
      });
    } catch (err) {
      console.error("Error adding fish:", err);
    }
  };

  /* =========================================================
     ADD KERALA ITEM
  ========================================================= */

  const addKeralaItem = async () => {
    if (!newItem.name.trim() || newItem.price === "") return;

    const numericPrice = Number(newItem.price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) return;

    try {
      const res = await fetch(`${API_URL}/kerala_items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItem.name.trim(),
          price: numericPrice,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        return;
      }

      const addedItem = await res.json();

      setKeralaItems((prev) => [
        ...prev,
        {
          ...addedItem,
          selected: true,
        },
      ]);

      setPriceInputs((prev) => ({
        ...prev,
        [`item-${addedItem.id}`]: String(
          addedItem.price ?? ""
        ),
      }));

      setNewItem({
        name: "",
        price: "",
      });
    } catch (err) {
      console.error("Error adding Kerala item:", err);
    }
  };

  /* =========================================================
     DELETE FISH
  ========================================================= */

  const deleteFish = async (id) => {
    if (!confirm("Delete this fish?")) return;

    try {
      const res = await fetch(`${API_URL}/fishes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete fish");
      }

      setFishes((prev) =>
        prev.filter((f) => f.id !== id)
      );

      setPriceInputs((prev) => {
        const next = { ...prev };
        delete next[`fish-${id}`];
        return next;
      });
    } catch (err) {
      console.error("Error deleting fish:", err);
    }
  };

  /* =========================================================
     DELETE KERALA ITEM
  ========================================================= */

  const deleteKeralaItem = async (id) => {
    if (!confirm("Delete this Kerala item?")) return;

    try {
      const res = await fetch(
        `${API_URL}/kerala_items/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete Kerala item");
      }

      setKeralaItems((prev) =>
        prev.filter((i) => i.id !== id)
      );

      setPriceInputs((prev) => {
        const next = { ...prev };
        delete next[`item-${id}`];
        return next;
      });
    } catch (err) {
      console.error("Error deleting Kerala item:", err);
    }
  };

  /* =========================================================
     TOGGLE
  ========================================================= */

  const toggleSelect = (listSetter, list, id) => {
    listSetter(
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              selected: !item.selected,
            }
          : item
      )
    );
  };

  /* =========================================================
     PRICE INPUT
  ========================================================= */

  const handlePriceInput = (type, id, value) => {
    if (value === "") {
      setPriceInputs((prev) => ({
        ...prev,
        [`${type}-${id}`]: "",
      }));
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) return;

    setPriceInputs((prev) => ({
      ...prev,
      [`${type}-${id}`]: value,
    }));
  };

  /* =========================================================
     UPDATE PRICE
  ========================================================= */

  const updatePrice = async (type, id) => {
    const key = `${type}-${id}`;
    const price = priceInputs[key];

    if (!id || price === "") return;

    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return;
    }

    const setter =
      type === "fish"
        ? setFishes
        : setKeralaItems;

    setter((list) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              price: numericPrice,
            }
          : item
      )
    );

    try {
      const res = await fetch(
        `${API_URL}/${
          type === "fish"
            ? "fishes"
            : "kerala_items"
        }/${id}/price`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price: numericPrice,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
      }
    } catch (err) {
      console.error(
        "Failed to update price:",
        err
      );
    }
  };

  /* =========================================================
     SHARE PRICE LIST
     
     MOBILE:
     - Try native file sharing first.
     
     DESKTOP / UNSUPPORTED:
     - Download PNG
     - Open WhatsApp with text
     
     NO ALERTS
  ========================================================= */

  const shareToWhatsApp = async () => {
    if (!listRef.current || isSharing) return;

    try {
      setIsSharing(true);

      /* =====================================================
         GENERATE PNG
      ===================================================== */

      const dataUrl =
        await htmlToImage.toPng(
          listRef.current,
          {
            quality: 1,
            pixelRatio: 2,
            cacheBust: true,
            backgroundColor: "#ffffff",
          }
        );

      /* =====================================================
         CONVERT DATA URL → BLOB
      ===================================================== */

      const response = await fetch(dataUrl);

      const blob = await response.blob();

      /* =====================================================
         CREATE FILE
      ===================================================== */

      const file = new File(
        [blob],
        "grl-fish-price-list.png",
        {
          type: "image/png",
        }
      );

      const shareText =
        "Today's GRL Fish & Kerala Store price list 🐟🥥";

      /* =====================================================
         TRY NATIVE FILE SHARE
         
         This will work only when the browser supports
         navigator.share + file sharing.

         We do NOT show an alert if unsupported.
      ===================================================== */

      const canUseNativeShare =
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({
          files: [file],
        });

      if (canUseNativeShare) {
        try {
          await navigator.share({
            files: [file],
            title: "GRL Fish & Kerala Store",
            text: shareText,
          });

          return;
        } catch (shareError) {
          /*
           * User cancelled the native share sheet.
           * Do nothing.
           */
          if (
            shareError?.name === "AbortError"
          ) {
            return;
          }

          console.warn(
            "Native file sharing failed:",
            shareError
          );
        }
      }

      /* =====================================================
         FALLBACK
         
         Browser doesn't support native file sharing.

         Download the PNG and open WhatsApp with text.
         
         WhatsApp URL cannot attach a locally generated
         image automatically.
      ===================================================== */

      const link =
        document.createElement("a");

      link.href = dataUrl;

      link.download =
        "grl-fish-price-list.png";

      document.body.appendChild(link);

      link.click();

      link.remove();

      /* =====================================================
         OPEN WHATSAPP
      ===================================================== */

      const whatsappUrl =
        `https://wa.me/?text=${encodeURIComponent(
          shareText
        )}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error(
        "Error sharing price list:",
        err
      );
    } finally {
      setIsSharing(false);
    }
  };

  /* =========================================================
     DATE
  ========================================================= */

  const formattedDate =
    new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

  const selectedFishes =
    fishes.filter((f) => f.selected);

  const selectedKeralaItems =
    keralaItems.filter(
      (i) => i.selected
    );

  /* =========================================================
     SMALL REUSABLE ICON
  ========================================================= */

  const IconBox = ({
    children,
    background,
  }) => (
    <span
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "12px",
        background,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "19px",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#F4F8FC 0%,#EEF3F8 100%)",
        padding: "18px 12px 40px",
        fontFamily:
          '"Inter","Segoe UI",Roboto,Arial,sans-serif',
        color: colors.text,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          margin: "0 auto",
        }}
      >

        {/* =================================================
            APP HEADER
        ================================================= */}

        <div
          style={{
            background:
              "linear-gradient(135deg,#123D70,#0B2C52)",
            borderRadius: "24px",
            padding:
              "22px 20px 20px",
            color: "white",
            boxShadow:
              "0 12px 30px rgba(18,61,112,.16)",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "13px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                background:
                  "rgba(255,255,255,.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "27px",
              }}
            >
              🐟
            </div>

            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  letterSpacing:
                    "-0.5px",
                }}
              >
                GRL Fish & Kerala Store
              </div>

              <div
                style={{
                  marginTop: "3px",
                  opacity: 0.78,
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Daily price list manager
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            ADD FISH
        ================================================= */}

        <div
          style={{
            background: colors.white,
            border: `1px solid ${colors.border}`,
            borderRadius: "20px",
            padding: "16px",
            marginBottom: "14px",
            boxShadow:
              "0 6px 20px rgba(31,55,80,.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
              marginBottom: "14px",
            }}
          >
            <IconBox background={colors.navySoft}>
              🐟
            </IconBox>

            <div>
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 900,
                  color: colors.navy,
                }}
              >
                Add Fish
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: colors.muted,
                  marginTop: "2px",
                }}
              >
                Add a new fish and price
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 115px 48px",
              gap: "8px",
            }}
          >
            <input
              type="text"
              placeholder="Fish name"
              value={newFish.name}
              onChange={(e) =>
                setNewFish({
                  ...newFish,
                  name: e.target.value,
                })
              }
              style={{
                minWidth: 0,
                height: "48px",
                border:
                  "1px solid #CBD6E2",
                borderRadius: "13px",
                padding: "0 13px",
                fontSize: "15px",
                outline: "none",
                background: "#FBFCFE",
              }}
            />

            <input
              type="text"
              inputMode="decimal"
              placeholder="Price ₹"
              value={newFish.price}
              onChange={(e) => {
                const value =
                  e.target.value;

                if (
                  /^\d*\.?\d*$/.test(
                    value
                  )
                ) {
                  setNewFish({
                    ...newFish,
                    price: value,
                  });
                }
              }}
              style={{
                minWidth: 0,
                height: "48px",
                border:
                  "1px solid #CBD6E2",
                borderRadius: "13px",
                padding: "0 12px",
                fontSize: "15px",
                fontWeight: 700,
                outline: "none",
                background: "#FBFCFE",
              }}
            />

            <button
              onClick={addFish}
              style={{
                border: "none",
                borderRadius: "13px",
                background: colors.green,
                color: "white",
                fontSize: "22px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* =================================================
            ADD KERALA ITEM
        ================================================= */}

        <div
          style={{
            background: colors.white,
            border: `1px solid ${colors.border}`,
            borderRadius: "20px",
            padding: "16px",
            marginBottom: "18px",
            boxShadow:
              "0 6px 20px rgba(31,55,80,.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
              marginBottom: "14px",
            }}
          >
            <IconBox background={colors.greenSoft}>
              🥥
            </IconBox>

            <div>
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 900,
                  color: colors.green,
                }}
              >
                Add Kerala Item
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: colors.muted,
                  marginTop: "2px",
                }}
              >
                Add groceries and essentials
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 115px 48px",
              gap: "8px",
            }}
          >
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  name: e.target.value,
                })
              }
              style={{
                minWidth: 0,
                height: "48px",
                border:
                  "1px solid #CBD6E2",
                borderRadius: "13px",
                padding: "0 13px",
                fontSize: "15px",
                outline: "none",
                background: "#FBFCFE",
              }}
            />

            <input
              type="text"
              inputMode="decimal"
              placeholder="Price ₹"
              value={newItem.price}
              onChange={(e) => {
                const value =
                  e.target.value;

                if (
                  /^\d*\.?\d*$/.test(
                    value
                  )
                ) {
                  setNewItem({
                    ...newItem,
                    price: value,
                  });
                }
              }}
              style={{
                minWidth: 0,
                height: "48px",
                border:
                  "1px solid #CBD6E2",
                borderRadius: "13px",
                padding: "0 12px",
                fontSize: "15px",
                fontWeight: 700,
                outline: "none",
                background: "#FBFCFE",
              }}
            />

            <button
              onClick={addKeralaItem}
              style={{
                border: "none",
                borderRadius: "13px",
                background: colors.green,
                color: "white",
                fontSize: "22px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* =================================================
            FISH MANAGEMENT
        ================================================= */}

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              padding: "0 3px",
            }}
          >
            <div
              style={{
                fontSize: "17px",
                fontWeight: 900,
                color: colors.navy,
              }}
            >
              Today's Fish
            </div>

            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: colors.muted,
              }}
            >
              {fishes.length} items
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {fishes.map((f) => (
              <div
                key={f.id}
                style={{
                  background: f.selected
                    ? "#F4FAF5"
                    : "#FFFFFF",
                  border: `1px solid ${
                    f.selected
                      ? "#C9E3CD"
                      : colors.border
                  }`,
                  borderRadius: "16px",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "14px",
                      color: colors.text,
                      overflow: "hidden",
                      textOverflow:
                        "ellipsis",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {f.name}
                  </div>

                  <div
                    style={{
                      fontSize: "11px",
                      color: colors.muted,
                      marginTop: "2px",
                    }}
                  >
                    ₹{f.price}/kg
                  </div>
                </div>

                <input
                  type="text"
                  inputMode="decimal"
                  value={
                    priceInputs[
                      `fish-${f.id}`
                    ] ?? ""
                  }
                  onChange={(e) =>
                    handlePriceInput(
                      "fish",
                      f.id,
                      e.target.value
                    )
                  }
                  onBlur={() =>
                    updatePrice(
                      "fish",
                      f.id
                    )
                  }
                  style={{
                    width: "82px",
                    height: "40px",
                    border:
                      "1px solid #C9D5E1",
                    borderRadius: "11px",
                    padding:
                      "0 9px",
                    fontWeight: 800,
                    fontSize: "14px",
                    textAlign: "right",
                    outline: "none",
                  }}
                />

                <button
                  onClick={() =>
                    toggleSelect(
                      setFishes,
                      fishes,
                      f.id
                    )
                  }
                  aria-label="Toggle fish"
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "none",
                    borderRadius: "11px",
                    background:
                      f.selected
                        ? colors.green
                        : "#E9EEF4",
                    color:
                      f.selected
                        ? "#fff"
                        : colors.muted,
                    fontSize: "17px",
                    cursor: "pointer",
                  }}
                >
                  {f.selected ? "✓" : "+"}
                </button>

                <button
                  onClick={() =>
                    deleteFish(f.id)
                  }
                  aria-label="Delete fish"
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "none",
                    borderRadius: "11px",
                    background:
                      "#FFF0F0",
                    color:
                      colors.danger,
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* =================================================
            KERALA MANAGEMENT
        ================================================= */}

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              padding: "0 3px",
            }}
          >
            <div
              style={{
                fontSize: "17px",
                fontWeight: 900,
                color: colors.green,
              }}
            >
              Kerala Items
            </div>

            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: colors.muted,
              }}
            >
              {keralaItems.length} items
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {keralaItems.map((i) => (
              <div
                key={i.id}
                style={{
                  background: i.selected
                    ? "#F5FAF5"
                    : "#FFFFFF",
                  border: `1px solid ${
                    i.selected
                      ? "#C9E3CD"
                      : colors.border
                  }`,
                  borderRadius: "16px",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "14px",
                      color: colors.text,
                      overflow: "hidden",
                      textOverflow:
                        "ellipsis",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {i.name}
                  </div>

                  <div
                    style={{
                      fontSize: "11px",
                      color: colors.muted,
                      marginTop: "2px",
                    }}
                  >
                    ₹{i.price}/pkt
                  </div>
                </div>

                <input
                  type="text"
                  inputMode="decimal"
                  value={
                    priceInputs[
                      `item-${i.id}`
                    ] ?? ""
                  }
                  onChange={(e) =>
                    handlePriceInput(
                      "item",
                      i.id,
                      e.target.value
                    )
                  }
                  onBlur={() =>
                    updatePrice(
                      "item",
                      i.id
                    )
                  }
                  style={{
                    width: "82px",
                    height: "40px",
                    border:
                      "1px solid #C9D5E1",
                    borderRadius: "11px",
                    padding:
                      "0 9px",
                    fontWeight: 800,
                    fontSize: "14px",
                    textAlign: "right",
                    outline: "none",
                  }}
                />

                <button
                  onClick={() =>
                    toggleSelect(
                      setKeralaItems,
                      keralaItems,
                      i.id
                    )
                  }
                  aria-label="Toggle Kerala item"
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "none",
                    borderRadius: "11px",
                    background:
                      i.selected
                        ? colors.green
                        : "#E9EEF4",
                    color:
                      i.selected
                        ? "#fff"
                        : colors.muted,
                    fontSize: "17px",
                    cursor: "pointer",
                  }}
                >
                  {i.selected ? "✓" : "+"}
                </button>

                <button
                  onClick={() =>
                    deleteKeralaItem(
                      i.id
                    )
                  }
                  aria-label="Delete Kerala item"
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "none",
                    borderRadius: "11px",
                    background:
                      "#FFF0F0",
                    color:
                      colors.danger,
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* =================================================
            POSTER
        ================================================= */}

        <div
          style={{
            width: "720px",
            maxWidth: "100%",
            margin:
              "25px auto 0",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          <div
            ref={listRef}
            style={{
              width: "720px",
              height: "960px",
              padding: "18px",
              boxSizing: "border-box",
              background:
                "linear-gradient(180deg,#FFFFFF 0%,#F7FAFD 100%)",
              color: colors.text,
              fontFamily:
                '"Segoe UI","Trebuchet MS",Arial,sans-serif',
              position: "relative",
              overflow: "hidden",
              border:
                "2px solid #C39A45",
              boxShadow:
                "0 0 0 7px #123D70 inset, 0 0 0 9px #FFFFFF inset",
            }}
          >
            <div
              style={{
                border:
                  "1px solid #173B6D",
                height: "100%",
                padding: "15px",
                boxSizing: "border-box",
                background:
                  "linear-gradient(180deg,#FFFFFF 0%,#F8FBFF 100%)",
                position: "relative",
              }}
            >

              {/* ================= HEADER ================= */}

              <div
                style={{
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "center",
                    alignItems:
                      "center",
                    gap: "8px",
                    color:
                      colors.gold,
                    fontSize: "18px",
                    fontWeight: 900,
                    letterSpacing:
                      "2px",
                  }}
                >
                  <span>✦</span>

                  <span
                    style={{
                      color:
                        colors.navy,
                    }}
                  >
                    FRESH DAILY
                  </span>

                  <span>✦</span>
                </div>

                <h2
                  style={{
                    margin:
                      "4px 0 0",
                    color:
                      colors.navy,
                    fontSize:
                      "32px",
                    lineHeight:
                      1.05,
                    fontWeight:
                      950,
                    letterSpacing:
                      "0.8px",
                  }}
                >
                  GRL FISH & KERALA STORE
                </h2>

                <div
                  style={{
                    marginTop:
                      "7px",
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap: "7px",
                    color:
                      colors.navy,
                    fontSize:
                      "14px",
                    fontWeight:
                      800,
                  }}
                >
                  <span>☎</span>

                  <span>
                    Home Delivery:
                    {" "}
                    7306698782
                  </span>
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    gap: "12px",
                    marginTop:
                      "9px",
                    color:
                      colors.navy,
                    fontSize:
                      "11px",
                    fontWeight:
                      800,
                  }}
                >
                  <span>
                    ◉ Today's Price List
                  </span>

                  <span
                    style={{
                      color:
                        colors.gold,
                    }}
                  >
                    |
                  </span>

                  <span>
                    ◷ {formattedDate}
                  </span>

                  <span
                    style={{
                      color:
                        colors.gold,
                    }}
                  >
                    |
                  </span>

                  <span>
                    ✓ All Prices Inclusive
                  </span>
                </div>

                <div
                  style={{
                    marginTop:
                      "10px",
                    borderBottom:
                      "2px solid #173B6D",
                    position:
                      "relative",
                  }}
                >
                  <div
                    style={{
                      position:
                        "absolute",
                      left: "50%",
                      top: "-7px",
                      transform:
                        "translateX(-50%)",
                      background:
                        "#FFFFFF",
                      padding:
                        "0 8px",
                      color:
                        colors.gold,
                      fontSize:
                        "11px",
                      fontWeight:
                        900,
                    }}
                  >
                    ◆ ◇ ◆
                  </div>
                </div>
              </div>

              {/* ================= SECTION HEADERS ================= */}

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1.05fr .95fr",
                  gap: "14px",
                  marginTop:
                    "13px",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "8px",
                    background:
                      colors.navy,
                    color:
                      "#FFFFFF",
                    padding:
                      "8px 13px",
                    borderRadius:
                      "14px",
                    fontSize:
                      "17px",
                    fontWeight:
                      950,
                    letterSpacing:
                      "0.2px",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius:
                        "9px",
                      background:
                        "rgba(255,255,255,.15)",
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      fontSize:
                        "15px",
                    }}
                  >
                    ≋
                  </span>

                  <span>
                    TODAY'S FISH LIST
                  </span>
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "8px",
                    background:
                      colors.green,
                    color:
                      "#FFFFFF",
                    padding:
                      "8px 13px",
                    borderRadius:
                      "14px",
                    fontSize:
                      "17px",
                    fontWeight:
                      950,
                    letterSpacing:
                      "0.2px",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius:
                        "9px",
                      background:
                        "rgba(255,255,255,.15)",
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      fontSize:
                        "15px",
                    }}
                  >
                    ◉
                  </span>

                  <span>
                    KERALA ITEMS
                  </span>
                </div>
              </div>

              {/* ================= TABLES ================= */}

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1.05fr .95fr",
                  gap: "14px",
                  marginTop:
                    "6px",
                  alignItems:
                    "start",
                }}
              >

                {/* FISH TABLE */}

                <table
                  style={{
                    width:
                      "100%",
                    borderCollapse:
                      "collapse",
                    background:
                      "#FFFFFF",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={
                          tableHeaderStyle
                        }
                      >
                        No.
                      </th>

                      <th
                        style={
                          tableHeaderStyle
                        }
                      >
                        FISH ITEM
                      </th>

                      <th
                        style={
                          tableHeaderStyle
                        }
                      >
                        PRICE ₹/kg
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedFishes.map(
                      (f, idx) => (
                        <tr
                          key={f.id}
                        >
                          <td
                            style={
                              tableCellCenterStyle
                            }
                          >
                            {idx + 1}
                          </td>

                          <td
                            style={
                              fishTableCellStyle
                            }
                          >
                            {f.name}
                          </td>

                          <td
                            style={{
                              ...tableCellRightStyle,
                              color:
                                colors.navy,
                              fontSize:
                                "13px",
                            }}
                          >
                            ₹
                            {Number(
                              f.price
                            ).toFixed(
                              2
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {/* KERALA TABLE */}

                <div>
                  <table
                    style={{
                      width:
                        "100%",
                      borderCollapse:
                        "collapse",
                      background:
                        "#FFFFFF",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={
                            greenHeaderStyle
                          }
                        >
                          No.
                        </th>

                        <th
                          style={
                            greenHeaderStyle
                          }
                        >
                          ITEM
                        </th>

                        <th
                          style={
                            greenHeaderStyle
                          }
                        >
                          PRICE ₹
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedKeralaItems.map(
                        (i, idx) => (
                          <tr
                            key={i.id}
                          >
                            <td
                              style={
                                tableCellCenterStyle
                              }
                            >
                              {idx + 1}
                            </td>

                            <td
                              style={
                                itemTableCellStyle
                              }
                            >
                              {i.name}
                            </td>

                            <td
                              style={{
                                ...tableCellRightStyle,
                                color:
                                  colors.green,
                                fontSize:
                                  "13px",
                              }}
                            >
                              ₹
                              {Number(
                                i.price
                              ).toFixed(
                                2
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  {/* QUALITY CARD */}

                  <div
                    style={{
                      marginTop:
                        "17px",
                      border:
                        "1px solid #B7C8DA",
                      borderRadius:
                        "12px",
                      padding:
                        "12px 10px",
                      textAlign:
                        "center",
                      background:
                        "linear-gradient(180deg,#FFFFFF,#F4F8FC)",
                    }}
                  >
                    <div
                      style={{
                        width:
                          "36px",
                        height:
                          "36px",
                        margin:
                          "0 auto 5px",
                        borderRadius:
                          "11px",
                        background:
                          colors.goldSoft,
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        color:
                          colors.gold,
                        fontSize:
                          "17px",
                        fontWeight:
                          900,
                      }}
                    >
                      ★
                    </div>

                    <div
                      style={{
                        color:
                          colors.navy,
                        fontSize:
                          "17px",
                        fontWeight:
                          950,
                      }}
                    >
                      FRESH & QUALITY
                    </div>

                    <div
                      style={{
                        color:
                          colors.green,
                        fontSize:
                          "11px",
                        fontWeight:
                          700,
                        fontStyle:
                          "italic",
                        marginTop:
                          "2px",
                      }}
                    >
                      Always the best for you!
                    </div>

                    <div
                      style={{
                        color:
                          colors.gold,
                        marginTop:
                          "4px",
                        fontSize:
                          "10px",
                      }}
                    >
                      ◆ ◇ ◆
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= NOTE ================= */}

              <div
                style={{
                  marginTop:
                    "12px",
                  border:
                    "1px solid #B9CADD",
                  borderRadius:
                    "11px",
                  padding:
                    "8px 12px",
                  background:
                    "#F3F7FC",
                  display:
                    "grid",
                  gridTemplateColumns:
                    "35px 1fr",
                  gap: "9px",
                  alignItems:
                    "center",
                }}
              >
                <div
                  style={{
                    width:
                      "32px",
                    height:
                      "32px",
                    borderRadius:
                      "10px",
                    background:
                      colors.navySoft,
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    color:
                      colors.navy,
                    fontSize:
                      "15px",
                    fontWeight:
                      900,
                  }}
                >
                  i
                </div>

                <div>
                  <div
                    style={{
                      fontSize:
                        "11px",
                      fontWeight:
                        950,
                      color:
                        colors.navy,
                      marginBottom:
                        "2px",
                    }}
                  >
                    PLEASE NOTE
                  </div>

                  <div
                    style={{
                      fontSize:
                        "9px",
                      lineHeight:
                        1.45,
                      color:
                        "#314962",
                      fontWeight:
                        600,
                    }}
                  >
                    • Daily price may vary based on availability.
                    <br />
                    • Please confirm the price while placing order.
                    <br />
                    • Cleaned & Cut fish available on request.
                  </div>
                </div>
              </div>

              {/* ================= FOOTER ================= */}

              <div
                style={{
                  position:
                    "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height:
                    "50px",
                  background:
                    colors.navyDark,
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  color:
                    "#FFFFFF",
                  fontSize:
                    "15px",
                  fontWeight:
                    800,
                  fontStyle:
                    "italic",
                  letterSpacing:
                    "0.2px",
                  borderTop:
                    `3px solid ${colors.gold}`,
                }}
              >
                Thank you for supporting local!

                <span
                  style={{
                    color:
                      colors.gold,
                    marginLeft:
                      "7px",
                    fontSize:
                      "17px",
                  }}
                >
                  ♥
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            SHARE BUTTON
        ================================================= */}

        <button
          onClick={shareToWhatsApp}
          disabled={isSharing}
          style={{
            width: "100%",
            height: "56px",
            marginTop: "18px",
            border: "none",
            borderRadius: "17px",
            background: isSharing
              ? "#7A8795"
              : "linear-gradient(135deg,#25D366,#159447)",
            color: "#FFFFFF",
            fontSize: "16px",
            fontWeight: 900,
            letterSpacing:
              "0.2px",
            boxShadow:
              "0 10px 25px rgba(37,211,102,.22)",
            cursor: isSharing
              ? "not-allowed"
              : "pointer",
          }}
        >
          {isSharing
            ? "Preparing price list..."
            : "Share Price List to WhatsApp"}
        </button>

        <div
          style={{
            textAlign: "center",
            color: colors.muted,
            fontSize: "11px",
            fontWeight: 600,
            marginTop: "9px",
          }}
        >
          High-resolution image • Optimized for WhatsApp
        </div>
      </div>
    </div>
  );
}