from fastapi import FastAPI

app = FastAPI(title="Discountly API")

@app.get("/health")
def health():
    return {"status": "ok"}