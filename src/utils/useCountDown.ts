import { format, formatDuration, intervalToDuration } from "date-fns";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export function useCountDown(endTime: number, cb?: () => void) {
  const [flip, updateFlip] = useState(false);
  const [cbCalled, updateCbCalled] = useState(false);

  const end = ethers.BigNumber.from(endTime ?? "0");
  const start = ethers.BigNumber.from(Math.floor(Date.now() / 1000));
  const pastEndTime = start.gte(end);
  const endToMsDate = new Date(end.mul(1000).toNumber());

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateFlip((f) => !f);
    }, 1000);
    if (pastEndTime && !cbCalled && end.gt(0) && cb) {
      cb?.();
      updateCbCalled(true);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [flip, pastEndTime, cb, cbCalled]);

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
