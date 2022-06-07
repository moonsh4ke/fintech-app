# Description
Basic ETF profitability calculator (react front-end mini app)

# Know issues
- API's endpoints are fetched only at the beginning (first render), therefore if there's a problem fetching, a reload is necesary to force the render.
- Undefined behavior outside the investment time horizont range {1, 22}
- Profitability's formula doesn't consider ETF's dividens
- 🍝
