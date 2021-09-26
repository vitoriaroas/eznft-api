

;; use the SIP090 interface (testnet)
(impl-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait.nft-trait)

;; define a new NFT. Make sure to replace EZNFTBOCA
(define-non-fungible-token EZNFTBOCA uint)

;; Store the last issues token ID
(define-data-var last-id uint u0)

;; Claim a new NFT
(define-public (claim)
  (mint tx-sender))

;; SIP009: Transfer token to a specified principal
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (if (and
        (is-eq tx-sender sender))
      ;; Make sure to replace EZNFTBOCA
      (match (nft-transfer? EZNFTBOCA token-id sender recipient)
        success (ok success)
        error (err error))
      (err u500)))

;; SIP009: Get the owner of the specified token ID
(define-read-only (get-owner (token-id uint))
  ;; Make sure to replace EZNFTBOCA
  (ok (nft-get-owner? EZNFTBOCA token-id)))

;; SIP009: Get the last token ID
(define-read-only (get-last-token-id)
  (ok (var-get last-id)))

;; SIP009: Get the token URI. You can set it to any other URI
(define-read-only (get-token-uri (token-id uint))
  (ok (some "https://docs.stacks.co")))

;; Internal - Mint new NFT
(define-private (mint (new-owner principal))
    (let ((next-id (+ u1 (var-get last-id))))
      ;; Make sure to replace EZNFTBOCA
      (match (nft-mint? EZNFTBOCA next-id new-owner)
        success
          (begin
            (var-set last-id next-id)
            (ok true))
        error (err error))))