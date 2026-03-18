# Saverly

Saverly is a web platform that helps users discover discount codes across Shopify-based e-commerce stores.

In addition to browsing available discount opportunities, users can submit requests for new Shopify stores they want analyzed. Those requests feed into an internal processing workflow, where store-specific discount discovery can be handled programmatically through backend workers.

---

## Overview

Saverly combines a user-facing web product with backend systems for discount discovery across Shopify stores.

The platform is designed around two main flows:

- **Discovery flow:** users browse and search for discount codes from supported Shopify stores
- **Request flow:** users submit a Shopify store they want analyzed, and the system processes that request through an internal worker pipeline

This makes Saverly more than a static coupon site: it is a system for collecting demand, analyzing store targets, and scaling discount discovery across multiple Shopify-based e-commerce sources.

---

## Problem

Discount discovery in e-commerce is fragmented and unreliable.

Users often have no easy way to know whether valid codes exist for a specific Shopify store, and most coupon platforms are either outdated, incomplete, or not designed around store-specific analysis.

At the same time, discovering and validating discount opportunities across Shopify stores requires structured workflows, request handling, and scalable processing beyond a simple frontend list of codes.

---

## Solution

Saverly provides:

- A frontend web experience where users can explore discount codes from different Shopify stores
- A request mechanism that allows users to submit new Shopify stores they want analyzed
- A backend-oriented workflow for processing store requests and supporting discount discovery logic
- A foundation for worker-based automation to scale analysis across multiple stores

---

## Core Product Flows

### 1. User discovery flow
Users can:
- browse discount codes across supported Shopify stores
- search for stores and available discounts
- use the platform as a centralized interface for Shopify discount discovery

### 2. Store request flow
Users can:
- submit a Shopify store they want Saverly to analyze
- trigger a request that enters the system for future processing
- expand platform coverage based on real user demand rather than only preloaded stores

### 3. Worker-based processing flow *(in progress)*
The system is being extended to support backend workers that:
- receive submitted store requests
- process analysis jobs asynchronously
- enable scalable handling of multiple store requests over time

---

## Architecture

Saverly is being designed as a product with both frontend and backend responsibilities.

Main components include:

- **Frontend application**  
  User-facing web interface for discovering discounts and submitting new store requests

- **Request intake layer**  
  Captures new Shopify store requests from users and records them for processing

- **Backend processing workflow**  
  Coordinates how submitted requests are handled internally

- **Worker system (in progress)**  
  Planned asynchronous job-processing layer for scaling request-based store analysis

---

## Why Shopify

Saverly focuses on Shopify stores because they provide a consistent e-commerce environment and a clear product surface for structured discount discovery workflows.

This gives the platform a narrower but more operationally coherent scope than trying to support every type of online store at once.

---

## Technical Focus

From an engineering perspective, Saverly involves:

- building a real user-facing product, not just an internal script
- designing request-driven workflows
- structuring systems that can evolve from synchronous interactions to asynchronous worker-based processing
- thinking about scale through queued job execution and store-level analysis pipelines

---

## Current Status

Implemented:
- frontend web product for discount discovery
- store request submission flow
- core product architecture and user flow design

In progress:
- backend worker system to process submitted Shopify store requests asynchronously

---

## Future Work

- implement the worker pipeline for submitted store requests
- improve store analysis coverage and reliability
- add request tracking and processing visibility
- build stronger backend infrastructure around queueing, retries, and monitoring

---

## Tech Stack

- **Frontend:** React
- **Backend:** Python
- **APIs / Integrations:** Shopify-related workflows, OpenAI API
- **System Design:** request-driven architecture, worker-based processing (in progress)

---

## Notes

Saverly is not just a coupon listing page. It is being built as a request-driven system for expanding discount discovery across Shopify stores based on real user demand.
