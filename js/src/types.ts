/**
 * TypeScript types for Rust Blockchain SDK
 */

/** Gateway envelope (`/api/v1` handlers: blocks, chain, transactions, mempool, health, version). */
export interface GatewayApiResponse<T> {
  status: string;
  status_code: number;
  message: string;
  data?: T | null;
  error?: ErrorDto | null;
  timestamp: string;
  trace_id: string;
}

export interface ErrorDto {
  code: string;
  message: string;
  field?: string | null;
}

/** Legacy envelope (handlers not yet migrated to the gateway). */
export interface LegacyApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string | null;
}

/** @deprecated Use `GatewayApiResponse<T>` or `LegacyApiResponse<T>`. */
export type ApiResponse<T> = LegacyApiResponse<T>;

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previous_hash: string;
  hash: string;
  nonce: number;
  merkle_root: string;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  data?: string | null;
  timestamp: number;
  signature: string;
}

export interface Wallet {
  address: string;
  balance: number;
  public_key: string;
}

export interface BlockchainInfo {
  block_count: number;
  difficulty: number;
  latest_block_hash: string;
  is_valid: boolean;
}

/** GET /chain/verify (gateway). */
export interface ChainVerification {
  valid: boolean;
  block_count: number;
}

export interface Peer {
  address: string;
  port: number;
}

export interface MempoolTransaction extends Transaction {
  // Same as Transaction
}

export interface Stats {
  blockchain: {
    block_count: number;
    total_transactions: number;
    difficulty: number;
    latest_block_hash: string;
    latest_block_index: number;
    total_coinbase: number;
    unique_addresses: number;
    avg_block_time_seconds: number;
    target_block_time: number;
    max_transactions_per_block: number;
    max_block_size_bytes: number;
  };
  mempool: {
    pending_transactions: number;
    total_fees_pending: number;
  };
  network: {
    connected_peers: number;
  };
}

/** GET /health (gateway). */
export interface HealthCheck {
  status: string;
  uptime_seconds: number;
  blockchain: {
    height: number;
    last_block_hash: string;
    validators_count: number;
  };
}

export interface CreateTransactionRequest {
  from: string;
  to: string;
  amount: number;
  fee?: number;
  data?: string;
  signature?: string;
}

export interface CreateBlockRequest {
  transactions: CreateTransactionRequest[];
}

/** GET /mempool (gateway) — `data` payload. */
export interface MempoolListResponse {
  count: number;
  transactions: Transaction[];
}

/** POST /mine (legacy) — `data` payload. */
export interface MineBlockResponse {
  hash: string;
  reward: number;
  transactions_count: number;
  validator?: string | null;
  consensus: string;
}

export interface CreateAPIKeyRequest {
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
}

export interface UsageStats {
  transactions_this_month: number;
  wallets_created: number;
  requests_this_month: number;
  tier: string;
  transaction_limit: number;
  wallet_limit: number;
}

export interface SDKConfig {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
}

export interface SmartContract {
  address: string;
  owner: string;
  contract_type: string;
  name: string;
  symbol?: string | null;
  total_supply?: number | null;
  decimals?: number | null;
  state: {
    balances: Record<string, number>;
    metadata: Record<string, string>;
  };
  bytecode?: number[] | null;
  abi?: string | null;
  created_at: number;
  updated_at: number;
}

export interface DeployContractRequest {
  owner: string;
  contract_type: string;
  name: string;
  symbol?: string;
  total_supply?: number;
  decimals?: number;
}

export interface ExecuteContractRequest {
  function: 'transfer' | 'mint' | 'burn' | 'custom';
  params: {
    from?: string;
    to?: string;
    amount?: number;
    name?: string;
    params?: string[];
  };
}

// ── Fabric-style types ───────────────────────────────────────────────────────

/** POST /gateway/submit request body. */
export interface GatewaySubmitRequest {
  chaincode_id: string;
  channel_id?: string;
  transaction: {
    id: string;
    input_did: string;
    output_recipient: string;
    amount: number;
  };
}

/** POST /gateway/submit response payload. */
export interface GatewaySubmitResponse {
  tx_id: string;
  block_height: number;
  valid?: boolean;
}

/** POST /chaincode/{id}/simulate request body. */
export interface SimulateRequest {
  function: string;
  version?: string;
}

/** POST /chaincode/{id}/simulate response payload. */
export interface SimulateResponse {
  result: string;
  rwset: {
    reads: { key: string; version: number }[];
    writes: { key: string; value: string }[];
  };
}

/** Organization registration. */
export interface Organization {
  org_id: string;
  name: string;
  msp_id: string;
  root_cert?: string;
}

/** Endorsement policy. */
export type EndorsementPolicy =
  | { AnyOf: string[] }
  | { AllOf: string[] }
  | { NOutOf: { n: number; orgs: string[] } };

/** Channel creation request. */
export interface CreateChannelRequest {
  channel_id: string;
  member_orgs?: string[];
}

/** Channel info response. */
export interface ChannelInfo {
  channel_id: string;
}

/** Private data hash response from PUT. */
export interface PrivateDataWriteResponse {
  collection: string;
  key: string;
  hash: string;
}

// ── Alias types ─────────────────────────────────────────────────────────────

/**
 * POST /alias/register request body.
 *
 * Signing payload (UTF-8 bytes): `"alias:register:{commitment}"`
 */
export interface AliasRegisterRequest {
  did: string;
  /** Ed25519 public key, hex-encoded (64 chars = 32 bytes). */
  public_key: string;
  /** SHA3-256 commitment: `hex(SHA3-256(salt || alias))`, 64 hex chars. */
  commitment: string;
  /** Deterministic salt, hex-encoded (32 chars = 16 bytes). */
  salt: string;
  /** AES-256-GCM encrypted alias (hex). Opaque to the node. */
  encrypted_alias: string;
  /** Ed25519 signature over `"alias:register:{commitment}"`, hex-encoded. */
  signature: string;
}

/** POST /alias/resolve request body. */
export interface AliasResolveRequest {
  commitment: string;
}

/** POST /alias/resolve response (active alias). */
export interface AliasResolveResponse {
  did: string;
  address: string;
}

/**
 * POST /alias/revoke request body.
 *
 * Signing payload (UTF-8 bytes): `"alias:revoke:{commitment}"`
 */
export interface AliasRevokeRequest {
  did: string;
  /** Ed25519 public key, hex-encoded (64 chars = 32 bytes). */
  public_key: string;
  commitment: string;
  /** Ed25519 signature over `"alias:revoke:{commitment}"`, hex-encoded. */
  signature: string;
}

/** POST /alias/register and POST /alias/revoke success response. */
export interface AliasActionResponse {
  commitment: string;
  did?: string;
  status?: string;
}

/** GET /alias/by-did/{did} response (active alias). */
export interface AliasByDidResponse {
  commitment: string;
  did: string;
  encrypted_alias: string;
  registered_at: number;
}

// ── Staking types ───────────────────────────────────────────────────────────

/** POST /staking/stake request body. */
export interface StakeRequest {
  address: string;
  amount: number;
}

/** POST /staking/unstake request body. */
export interface UnstakeRequest {
  address: string;
  /** Amount to unstake. Omit to unstake all. */
  amount?: number;
}

/** POST /staking/complete-unstake request body. */
export interface CompleteUnstakeRequest {
  address: string;
}

/** POST /staking/stake response. */
export interface StakeResponse {
  address: string;
  staked: number;
}

/** POST /staking/unstake response. */
export interface UnstakeResponse {
  address: string;
  unstake_amount: number;
  status: string;
}

/** POST /staking/complete-unstake response. */
export interface CompleteUnstakeResponse {
  address: string;
  released: number;
  status: string;
}

/** Validator info (GET /staking/validators, /validator/{address}, /my-stake/{address}). */
export interface Validator {
  address: string;
  staked_amount: number;
  is_active: boolean;
  total_rewards: number;
  created_at: number;
  last_validated_block: number;
  validation_count: number;
  slash_count: number;
  unstaking_requested: boolean;
  unstaking_timestamp?: number | null;
}

// ── Inference Oracle types ──────────────────────────────────────────────────

/** Tolerance mode for comparing inference outputs during disputes. */
export type OutputTolerance =
  | 'Exact'
  | { Numeric: { threshold: number } }
  | { Cosine: { min_similarity: number } };

/** Claim status in the optimistic oracle lifecycle. */
export type ClaimStatus = 'Pending' | 'Finalized' | 'Disputed' | 'Slashed' | 'Rejected';

/** Proof types for zkML bridge. */
export type ProofType = 'Sha256Commitment' | 'Groth16Bn254' | 'PlonkBn254' | 'StarkFri';

/** ZK proof submitted with a proven inference claim. */
export interface ZkInferenceProof {
  proof_type: ProofType;
  /** Proof bytes, hex-encoded. */
  proof_data: string;
  /** Verification key, hex-encoded (required for SNARK/STARK). */
  verification_key?: string | null;
}

/**
 * POST /inference/submit request body.
 *
 * Signing payload: `"inference:submit:{model_hash}:{output_hash}"` as UTF-8 bytes.
 */
export interface SubmitInferenceRequest {
  oracle_id: string;
  /** SHA3-256 of model weights (64 hex chars). */
  model_hash: string;
  model_version: string;
  /** SHA3-256 of input data (64 hex chars). */
  input_hash: string;
  input_uri?: string;
  /** Inference output (JSON-serialized). */
  output: string;
  /** SHA3-256 of output (64 hex chars). */
  output_hash: string;
  /** Ed25519 signature over signing payload, hex-encoded. */
  signature: string;
  /** Ed25519 public key (hex, 64 chars). */
  public_key: string;
  tolerance?: OutputTolerance;
}

/** POST /inference/submit-proven request body. */
export interface SubmitProvenRequest extends SubmitInferenceRequest {
  proof: ZkInferenceProof;
}

/**
 * POST /inference/challenge request body.
 *
 * Signing payload: `"challenge:{claim_id}:{challenger_output_hash}"` as UTF-8 bytes.
 */
export interface ChallengeInferenceRequest {
  claim_id: string;
  challenger_id: string;
  challenger_output: string;
  /** SHA3-256 of challenger output (64 hex chars). */
  challenger_output_hash: string;
  /** Ed25519 signature over signing payload, hex-encoded. */
  signature: string;
  /** Ed25519 public key (hex, 64 chars). */
  public_key: string;
}

/** Inference claim returned by GET /inference/claims. */
export interface InferenceClaim {
  id: string;
  oracle_id: string;
  model_hash: string;
  model_version: string;
  input_hash: string;
  input_uri?: string | null;
  output: string;
  output_hash: string;
  timestamp: number;
  signature: string;
  status: ClaimStatus;
  tolerance: OutputTolerance;
  dispute_deadline: number;
  finalized_at?: number | null;
}

/** POST /inference/submit response. */
export interface SubmitInferenceResponse {
  id: string;
  status: string;
  dispute_deadline: number;
}

/** POST /inference/submit-proven response. */
export interface SubmitProvenResponse {
  id: string;
  status: string;
  proof_type: string;
  finalized_at: number;
}

/** POST /inference/challenge response. */
export interface ChallengeResponse {
  challenge_id: string;
  claim_id: string;
  succeeded: boolean;
  claim_status: string;
  oracle_id: string;
  challenger_id: string;
}

/** POST /inference/finalize response. */
export interface FinalizeResponse {
  id: string;
  status: string;
  finalized_at: number;
}

/** GET /inference/models response item. */
export interface ModelSummary {
  model_hash: string;
  model_version: string;
  total_claims: number;
  finalized: number;
  pending: number;
}

/** Query params for GET /inference/claims. */
export interface ListClaimsQuery {
  status?: string;
  oracle_id?: string;
  model_hash?: string;
}

