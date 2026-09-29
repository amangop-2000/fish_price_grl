import React from "react";

const formatPrice = (price) => {
  const value = Number(price);

  if (Number.isNaN(value)) return "₹0";

  return `₹${value.toLocaleString("en-IN")}`;
};

const OfferPoster = ({ offerType, products }) => {
  const validProducts = products.filter(
    (product) =>
      product.name.trim() &&
      product.originalPrice !== "" &&
      product.offerPrice !== ""
  );

  const isFiveProducts = validProducts.length >= 5;

  return (
    <div
      style={{
        width: "720px",
        height: "960px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily:
          "'Trebuchet MS', 'Segoe UI', Arial, Helvetica, sans-serif",
        color: "#FFFFFF",
        background:
          "linear-gradient(145deg, #06172B 0%, #0B2C52 48%, #123D70 100%)",
      }}
    >
      {/* =========================================================
          DECORATIVE BACKGROUND
      ========================================================== */}

      <div
        style={{
          position: "absolute",
          width: "330px",
          height: "330px",
          borderRadius: "50%",
          top: "-190px",
          right: "-110px",
          background: "rgba(195,154,69,0.18)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          bottom: "-170px",
          left: "-130px",
          background: "rgba(255,255,255,0.06)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          border: "2px solid rgba(195,154,69,0.12)",
          borderRadius: "50%",
          top: "150px",
          right: "-260px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "12px",
          height: "12px",
          background: "#C39A45",
          transform: "rotate(45deg)",
          top: "150px",
          left: "28px",
          opacity: 0.8,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "8px",
          height: "8px",
          background: "#D64545",
          transform: "rotate(45deg)",
          top: "180px",
          left: "52px",
        }}
      />

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          padding: isFiveProducts
            ? "28px 32px 24px"
            : "32px 34px 28px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* =======================================================
            STORE BRAND
        ======================================================== */}

        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: isFiveProducts ? "13px" : "14px",
              fontWeight: "800",
              letterSpacing: "5px",
              color: "#C39A45",
              marginBottom: "6px",
            }}
          >
            WELCOME TO
          </div>

          <div
            style={{
              fontSize: isFiveProducts ? "26px" : "28px",
              fontWeight: "900",
              letterSpacing: "2.5px",
              color: "#FFFFFF",
              textShadow: "0 3px 10px rgba(0,0,0,0.25)",
            }}
          >
            GRL FISH & KERALA STORE
          </div>

          <div
            style={{
              width: "100px",
              height: "3px",
              background:
                "linear-gradient(90deg, transparent, #C39A45, transparent)",
              margin: "10px auto 0",
            }}
          />
        </div>

        {/* =======================================================
            OFFER BADGE
        ======================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: isFiveProducts ? "16px" : "22px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: isFiveProducts ? "7px 18px" : "8px 20px",
              borderRadius: "30px",
              background:
                "linear-gradient(135deg, #D64545 0%, #B92F2F 100%)",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.28)",
              fontSize: isFiveProducts ? "13px" : "14px",
              fontWeight: "900",
              letterSpacing: "2px",
            }}
          >
            <span style={{ fontSize: "17px" }}>🔥</span>
            LIMITED TIME OFFER
          </div>
        </div>

        {/* =======================================================
            MAIN TITLE
        ======================================================== */}

        <div
          style={{
            textAlign: "center",
            marginTop: isFiveProducts ? "14px" : "18px",
          }}
        >
          <div
            style={{
              fontSize: offerType.length > 15
                ? isFiveProducts
                  ? "40px"
                  : "48px"
                : isFiveProducts
                ? "48px"
                : "57px",
              lineHeight: "0.98",
              fontWeight: "900",
              letterSpacing: "-1px",
              textTransform: "uppercase",
              color: "#FFFFFF",
              textShadow: "0 5px 14px rgba(0,0,0,0.28)",
            }}
          >
            {offerType}
          </div>

          <div
            style={{
              marginTop: isFiveProducts ? "8px" : "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              fontSize: isFiveProducts ? "12px" : "14px",
              fontWeight: "800",
              letterSpacing: "3px",
              color: "#F5D98A",
            }}
          >
            <span>✦</span>
            <span>FRESH DEALS</span>
            <span>•</span>
            <span>GREAT PRICES</span>
            <span>✦</span>
          </div>
        </div>

        {/* =======================================================
            PRODUCT SECTION
        ======================================================== */}

        <div
          style={{
            marginTop: isFiveProducts ? "17px" : "25px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: isFiveProducts ? "7px" : "11px",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {validProducts.length === 0 && (
            <div
              style={{
                flex: 1,
                minHeight: "300px",
                borderRadius: "20px",
                border: "1px dashed rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#B9C7D8",
                fontSize: "18px",
              }}
            >
              Add products to preview the offer
            </div>
          )}

          {validProducts.map((product, index) => {
            const original = Number(product.originalPrice);
            const offer = Number(product.offerPrice);
            const savings = original - offer;

            const discount =
              original > 0
                ? Math.round(((original - offer) / original) * 100)
                : 0;

            return (
              <div
                key={index}
                style={{
                  position: "relative",

                  height: isFiveProducts ? "88px" : "105px",
                  minHeight: isFiveProducts ? "88px" : "105px",

                  boxSizing: "border-box",

                  padding: isFiveProducts
                    ? "9px 13px 9px 14px"
                    : "15px 18px",

                  borderRadius: isFiveProducts ? "15px" : "18px",

                  background:
                    "linear-gradient(105deg, rgba(255,255,255,0.13), rgba(255,255,255,0.055))",

                  border: "1px solid rgba(255,255,255,0.18)",

                  boxShadow:
                    "0 10px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.06)",

                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {/* Gold side accent */}

                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: isFiveProducts ? "4px" : "5px",
                    background:
                      "linear-gradient(180deg, #F5D98A, #C39A45)",
                  }}
                />

                {/* =================================================
                    PRODUCT NUMBER
                ================================================== */}

                <div
                  style={{
                    width: isFiveProducts ? "31px" : "38px",
                    height: isFiveProducts ? "31px" : "38px",
                    minWidth: isFiveProducts ? "31px" : "38px",

                    borderRadius: "50%",

                    background: "rgba(195,154,69,0.16)",
                    border: "1px solid rgba(195,154,69,0.4)",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    color: "#F5D98A",

                    fontSize: isFiveProducts ? "13px" : "15px",
                    fontWeight: "900",

                    marginRight: isFiveProducts ? "10px" : "14px",
                  }}
                >
                  {index + 1}
                </div>

                {/* =================================================
                    PRODUCT DETAILS
                ================================================== */}

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    paddingRight: isFiveProducts ? "8px" : "4px",
                  }}
                >
                  {/* Product Name */}

                  <div
                    style={{
                      fontSize: isFiveProducts ? "19px" : "23px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",

                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",

                      marginBottom: isFiveProducts ? "5px" : "7px",
                    }}
                  >
                    {product.name}
                  </div>

                  {/* Price + Badges */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: isFiveProducts ? "6px" : "9px",

                      flexWrap: "nowrap",

                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    {/* Original Price */}

                    <span
                      style={{
                        color: "#C6D1DF",
                        fontSize: isFiveProducts ? "14px" : "16px",
                        fontWeight: "600",

                        textDecoration: "line-through",
                        textDecorationThickness: "2px",

                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {formatPrice(original)}
                    </span>

                    {/* SAVE */}

                    {savings > 0 && (
                      <span
                        style={{
                          padding: isFiveProducts
                            ? "3px 6px"
                            : "4px 9px",

                          borderRadius: "20px",

                          background: "#2F7D32",
                          color: "#FFFFFF",

                          fontSize: isFiveProducts ? "9px" : "11px",
                          fontWeight: "900",

                          letterSpacing: "0.3px",

                          whiteSpace: "nowrap",
                          flexShrink: 1,

                          overflow: "hidden",
                          textOverflow: "ellipsis",

                          maxWidth: isFiveProducts ? "95px" : "120px",

                          boxShadow:
                            "0 3px 8px rgba(0,0,0,0.18)",
                        }}
                      >
                        SAVE {formatPrice(savings)}
                      </span>
                    )}

                    {/* DISCOUNT */}

                    {discount > 0 && (
                      <span
                        style={{
                          padding: isFiveProducts
                            ? "3px 6px"
                            : "4px 8px",

                          borderRadius: "20px",

                          background: "rgba(214,69,69,0.18)",
                          color: "#FFB1B1",

                          border:
                            "1px solid rgba(214,69,69,0.3)",

                          fontSize: isFiveProducts ? "9px" : "11px",
                          fontWeight: "900",

                          whiteSpace: "nowrap",
                          flexShrink: 0,

                          lineHeight: "1.2",
                        }}
                      >
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* =================================================
                    OFFER PRICE
                ================================================== */}

                <div
                  style={{
                    width: isFiveProducts ? "112px" : "135px",
                    minWidth: isFiveProducts ? "112px" : "135px",

                    marginLeft: isFiveProducts ? "5px" : "12px",

                    textAlign: "right",

                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: isFiveProducts ? "8px" : "10px",
                      fontWeight: "900",
                      letterSpacing: isFiveProducts ? "1px" : "1.5px",
                      color: "#F5D98A",
                      marginBottom: "2px",
                    }}
                  >
                    OFFER PRICE
                  </div>

                  <div
                    style={{
                      fontSize: isFiveProducts ? "30px" : "39px",
                      lineHeight: "1",
                      fontWeight: "900",
                      letterSpacing: "-1.5px",
                      color: "#FFFFFF",
                      textShadow: "0 3px 8px rgba(0,0,0,0.25)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatPrice(offer)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =======================================================
            CTA
        ======================================================== */}

        <div
          style={{
            marginTop: isFiveProducts ? "10px" : "16px",

            borderRadius: isFiveProducts ? "13px" : "15px",

            padding: isFiveProducts
              ? "9px 16px"
              : "13px 18px",

            background:
              "linear-gradient(135deg, #D64545 0%, #B92F2F 100%)",

            border: "1px solid rgba(255,255,255,0.18)",

            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",

            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: isFiveProducts ? "16px" : "19px",
              fontWeight: "900",
              letterSpacing: "1px",
            }}
          >
            🛒 GRAB YOUR DEAL TODAY!
          </div>

          <div
            style={{
              marginTop: "2px",
              fontSize: isFiveProducts ? "9px" : "11px",
              fontWeight: "700",
              letterSpacing: "2px",
              opacity: 0.9,
            }}
          >
            LIMITED STOCK • LIMITED TIME
          </div>
        </div>

        {/* =======================================================
            FOOTER
        ======================================================== */}

        <div
          style={{
            marginTop: isFiveProducts ? "9px" : "14px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: isFiveProducts ? "10px" : "12px",
              fontWeight: "800",
              letterSpacing: "2px",
              color: "#C6D1DF",
            }}
          >
            FRESH FISH • KERALA SPECIALITIES
          </div>

          <div
            style={{
              marginTop: isFiveProducts ? "4px" : "6px",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              gap: "8px",

              fontSize: isFiveProducts ? "17px" : "19px",
              fontWeight: "900",

              color: "#F5D98A",
            }}
          >
            <span>📞</span>
            <span>7306698782</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferPoster;