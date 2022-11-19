import React from "react";
import { Button } from "../Button/Button";

import { useClaimMany } from "../../utils/useClaimMany";

export const ClaimMany = React.memo(
  ({ tokenIds }: { tokenIds: string[] }) => {
    const { data: contractWrite, writeAsync, isLoading, isError } = useClaimMany(tokenIds)

    const claimMany = async () => {
      if (writeAsync) {
        const tx = await writeAsync();
        console.log(tx);
      }
    };

    return (
      <Button
        onClick={claimMany}
        disabled={!!contractWrite || isLoading}
      >
        Claim All
      </Button>
    );
  })