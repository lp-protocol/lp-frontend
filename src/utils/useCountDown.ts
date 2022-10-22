import { format, formatDuration, intervalToDuration } from "date-fns";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export function useCountDown(endTime: number) {
  const [flip, updateFlip] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateFlip((f) => !f);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [flip]);

  const end = ethers.BigNumber.from(endTime ?? "0");
  const start = ethers.BigNumber.from(Math.floor(Date.now() / 1000));
  const pastEndTime = start.gte(end);
  const endToMsDate = new Date(end.mul(1000).toNumber());

  const formatted = format(endToMsDate, "MMM dd 'at' h:mm:ss a");
  let formattedDuration = "";
  let hours, minutes, seconds, days, months;
  if (!pastEndTime) {
    const params = {
      start: new Date(start.mul(1000).toNumber()),
      end: new Date(end.mul(1000).toNumber()),
    };
    const duration = intervalToDuration(params);
    ({ months, days, hours, minutes, seconds } = duration);
    formattedDuration = formatDuration(duration, {
      format: ["months", "days", "hours", "minutes", "seconds"],
    });
  }

  return {
    end,
    start,
    pastEndTime,
    flip,
    hours,
    minutes,
    seconds,
    formatted,
    formattedDuration,
    days,
    months,
  };
}

// let hours, minutes, seconds;
// if (!pastEndTime) {
//   ({ hours, minutes, seconds } = intervalToDuration({
//     start: start.times(1000).toNumber(),
//     end: endToMsDate,
//   }));
// }
