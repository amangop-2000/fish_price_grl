import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import OfferPoster from "./OfferPoster";

const OFFER_TYPES = [
  "Saturday Special",
  "Weekend Offer",
  "Festival Offer",
  "Flash Sale",
  "Special Offer",
  "Mega Deal",
  "Today's Deal",
];

const createEmptyProduct = () => ({
  name: "",
  originalPrice: "",
  offerPrice: "",
});

const OfferCreator = () => {
  const posterRef = useRef(null);

  const [offerType, setOfferType] = useState("Saturday Special");

  const [offerProducts, setOfferProducts] = useState([
    createEmptyProduct(),
  ]);

  const updateProduct = (index, field, value) => {
    setOfferProducts((previous) =>
      previous.map((product, productIndex) =>
        productIndex === index
          ? {
              ...product,
              [field]: value,
            }
          : product
      )
    );
  };

  const addProduct = () => {
    if (offerProducts.length >= 5) return;

    setOfferProducts((previous) => [
      ...previous,
      createEmptyProduct(),
    ]);
  };

  const removeProduct = (index) => {
    setOfferProducts((previous) =>
      previous.filter((_, productIndex) => productIndex !== index)
    );
  };

  const generatePoster = async () => {
    if (!posterRef.current) return;

    try {
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement("a");

      link.download = `GRL-${offerType
        .replace(/\s+/g, "-")
        .toLowerCase()}.png`;

      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate poster:", error);
    }
  };

  const sharePoster = async () => {
    if (!posterRef.current) return;

    try {
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      const file = new File(
        [blob],
        `GRL-${offerType.replace(/\s+/g, "-")}.png`,
        {
          type: "image/png",
        }
      );

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `GRL ${offerType}`,
          text: `🔥 ${offerType} - GRL Fish & Kerala Store`,
          files: [file],
        });

        return;
      }

      const link = document.createElement("a");

      link.download = `GRL-${offerType
        .replace(/\s+/g, "-")
        .toLowerCase()}.png`;

      link.href = dataUrl;
      link.click();

      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          `🔥 ${offerType}\n\nGRL Fish & Kerala Store\n📞 7306698782`
        )}`,
        "_blank"
      );
    } catch (error) {
      console.error("Failed to share poster:", error);
    }
  };

  return (
    <section
      style={{
        marginTop: "40px",
        padding: "24px",
        background: "#FFFFFF",
        border: "1px solid #D7E0EA",
        borderRadius: "20px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            margin: 0,
            color: "#123D70",
            fontSize: "28px",
          }}
        >
          🔥 Offer Poster
        </h2>

        <p
          style={{
            marginTop: "6px",
            color: "#66758A",
          }}
        >
          Create a promotional poster with up to 5 products.
        </p>
      </div>

      {/* Offer type */}
      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "700",
            color: "#172B43",
          }}
        >
          Offer Type
        </label>

        <select
          value={offerType}
          onChange={(event) => setOfferType(event.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #D7E0EA",
            fontSize: "16px",
            background: "#FFFFFF",
          }}
        >
          {OFFER_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Products */}
      <div>
        {offerProducts.map((product, index) => (
          <div
            key={index}
            style={{
              padding: "18px",
              marginBottom: "14px",
              border: "1px solid #D7E0EA",
              borderRadius: "14px",
              background: "#F8FAFC",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <strong
                style={{
                  color: "#123D70",
                  fontSize: "17px",
                }}
              >
                Product {index + 1}
              </strong>

              {offerProducts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  style={{
                    border: "none",
                    background: "#FDECEC",
                    color: "#D64545",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "700",
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(180px, 2fr) minmax(130px, 1fr) minmax(130px, 1fr)",
                gap: "12px",
              }}
            >
              {/* Product name */}
              <input
                type="text"
                placeholder="Product name"
                value={product.name}
                onChange={(event) =>
                  updateProduct(index, "name", event.target.value)
                }
                style={inputStyle}
              />

              {/* Original price */}
              <input
                type="number"
                min="0"
                placeholder="Original price"
                value={product.originalPrice}
                onChange={(event) =>
                  updateProduct(
                    index,
                    "originalPrice",
                    event.target.value
                  )
                }
                style={inputStyle}
              />

              {/* Offer price */}
              <input
                type="number"
                min="0"
                placeholder="Offer price"
                value={product.offerPrice}
                onChange={(event) =>
                  updateProduct(
                    index,
                    "offerPrice",
                    event.target.value
                  )
                }
                style={inputStyle}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add product */}
      <button
        type="button"
        onClick={addProduct}
        disabled={offerProducts.length >= 5}
        style={{
          padding: "11px 18px",
          borderRadius: "10px",
          border: "none",
          background:
            offerProducts.length >= 5 ? "#CBD5E1" : "#123D70",
          color: "#FFFFFF",
          cursor:
            offerProducts.length >= 5 ? "not-allowed" : "pointer",
          fontWeight: "700",
        }}
      >
        + Add Product
      </button>

      <div
        style={{
          marginTop: "8px",
          fontSize: "13px",
          color: "#66758A",
        }}
      >
        {offerProducts.length}/5 products
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "24px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={generatePoster}
          style={primaryButton}
        >
          📥 Download Poster
        </button>

        <button
          type="button"
          onClick={sharePoster}
          style={secondaryButton}
        >
          📲 Share Poster
        </button>
      </div>

      {/* Poster preview */}
      <div
        style={{
          marginTop: "35px",
        }}
      >
        <h3
          style={{
            color: "#123D70",
            marginBottom: "15px",
          }}
        >
          Poster Preview
        </h3>

        <div
          style={{
            width: "100%",
            overflowX: "auto",
            padding: "10px",
            background: "#F1F5F9",
            borderRadius: "15px",
          }}
        >
          <div
            ref={posterRef}
            style={{
              width: "720px",
              minWidth: "720px",
            }}
          >
            <OfferPoster
              offerType={offerType}
              products={offerProducts}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #D7E0EA",
  fontSize: "15px",
  outline: "none",
};

const primaryButton = {
  padding: "13px 20px",
  borderRadius: "10px",
  border: "none",
  background: "#123D70",
  color: "#FFFFFF",
  fontWeight: "700",
  cursor: "pointer",
};

const secondaryButton = {
  padding: "13px 20px",
  borderRadius: "10px",
  border: "none",
  background: "#2F7D32",
  color: "#FFFFFF",
  fontWeight: "700",
  cursor: "pointer",
};

export default OfferCreator;