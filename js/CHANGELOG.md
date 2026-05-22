# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [Unreleased]

### 2026-05-22

**Inference Oracle support (Optimistic ML Oracle)**

- `submitInference()` — submit claim with dispute window (optimistic)
- `submitProvenInference()` — submit claim with ZK proof (instant finalization)
- `challengeInference()` — challenge a pending claim
- `finalizeInference(claimId)` — finalize after dispute window
- `listInferenceClaims(query?)` — list claims with status/oracle/model filters
- `getInferenceClaim(claimId)` — get claim details
- `listInferenceModels()` — list known models with claim counts
- New types: `InferenceClaim`, `OutputTolerance`, `ClaimStatus`, `ProofType`, `ZkInferenceProof`, `ModelSummary`, and request/response types for all endpoints

**Staking support**

- `stake()` — stake tokens to become a validator
- `unstake()` — request unstaking (lock period)
- `completeUnstake()` — complete unstaking after lock period
- `getValidators()` — list active validators
- `getValidator(address)` — get validator info
- `getMyStake(address)` — get own stake info
- New types: `StakeRequest`, `StakeResponse`, `UnstakeRequest`, `UnstakeResponse`, `CompleteUnstakeRequest`, `CompleteUnstakeResponse`, `Validator`

**Alias registry support**

- `registerAlias()` — register an alias commitment with Ed25519 signature
- `resolveAlias()` — resolve a commitment to DID + address
- `revokeAlias()` — revoke an alias (15-day cooldown before re-registration)
- `getAliasByDid()` — reverse lookup: resolve a DID to its active alias
- New types: `AliasRegisterRequest`, `AliasResolveRequest`, `AliasResolveResponse`, `AliasRevokeRequest`, `AliasActionResponse`, `AliasByDidResponse`

**Signing payload format**

The node expects context-prefixed signing payloads to prevent cross-endpoint replay:

| Endpoint | Signing payload (UTF-8 bytes) |
|---|---|
| `POST /alias/register` | `alias:register:{commitment}` |
| `POST /alias/revoke` | `alias:revoke:{commitment}` |

```typescript
// Example: register
const message = Buffer.from(`alias:register:${commitmentHex}`, 'utf-8');
const signature = ed25519.sign(message, privateKey);

// Example: revoke
const message = Buffer.from(`alias:revoke:${commitmentHex}`, 'utf-8');
const signature = ed25519.sign(message, privateKey);
```
