import React, { useEffect, useState } from "react";
import useContracts from "../hooks/useContracts";
import { useStoreState } from "../store/globalStore";
import Future from "./Future";

const FutureContainer: React.FunctionComponent = () => {
  const { currentToken, web3, network } = useStoreState((state) => state);
  const { getFuturesList, getUnderlyingAddress } = useContracts();

  const [sevenDayFutures, set7DayFutures] = useState<any>([]);
  const [thirtyDayFutures, set30DayFutures] = useState<any>([]);
  const [ninetyDayFutures, set90DayFutures] = useState<any>([]);

  const [sevenDayFutures2, set7DayFutures2] = useState<any>([]);
  const [thirtyDayFutures2, set30DayFutures2] = useState<any>([]);
  const [ninetyDayFutures2, set90DayFutures2] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const underlyingToken = getUnderlyingAddress();

      const sevenDayFutures = await getFuturesList(
        underlyingToken,
        5760 * 7,
        1
      );
      set7DayFutures(sevenDayFutures);

      const thirtyDayFutures = await getFuturesList(
        underlyingToken,
        5760 * 30,
        1
      );
      set30DayFutures(thirtyDayFutures);

      const ninetyDayFutures = await getFuturesList(
        underlyingToken,
        5760 * 90,
        1
      );
      set90DayFutures(ninetyDayFutures);

      const sevenDayFutures2 = await getFuturesList(
        underlyingToken,
        5760 * 7,
        2
      );
      set7DayFutures2(sevenDayFutures2);

      const thirtyDayFutures2 = await getFuturesList(
        underlyingToken,
        5760 * 30,
        2
      );
      set30DayFutures2(thirtyDayFutures2);

      const ninetyDayFutures2 = await getFuturesList(
        underlyingToken,
        5760 * 90,
        2
      );
      set90DayFutures2(ninetyDayFutures2);

      setLoading(false);
    };

    if (network === "kovan") {
      fetchData();
    }

    // eslint-disable-next-line
  }, [currentToken, web3, network]);

  return (
    <div className="futures-container">
      {loading && network !== "kovan" ? (
        <div className="coming-soon">loading...</div>
      ) : network === "kovan" ? (
        <>
          {sevenDayFutures.map((future: any, index: number) => (
            <Future
              key={index}
              duration={7}
              futureID={index}
              futureAddress={future}
              cid={1}
            />
          ))}

          {sevenDayFutures2.map((future: any, index: number) => (
            <Future
              key={index}
              duration={7}
              futureID={index}
              futureAddress={future}
              cid={2}
            />
          ))}

          {thirtyDayFutures.map((future: any, index: number) => (
            <Future
              key={index}
              duration={30}
              futureID={index}
              futureAddress={future}
              cid={1}
            />
          ))}

          {thirtyDayFutures2.map((future: any, index: number) => (
            <Future
              key={index}
              duration={30}
              futureID={index}
              futureAddress={future}
              cid={2}
            />
          ))}

          {ninetyDayFutures.map((future: any, index: number) => (
            <Future
              key={index}
              duration={90}
              futureID={index}
              futureAddress={future}
              cid={1}
            />
          ))}

          {ninetyDayFutures2.map((future: any, index: number) => (
            <Future
              key={index}
              duration={90}
              futureID={index}
              futureAddress={future}
              cid={2}
            />
          ))}
        </>
      ) : (
        <div className="coming-soon">change network</div>
      )}

      {!loading &&
        sevenDayFutures.length === 0 &&
        thirtyDayFutures.length === 0 && (
          <div className="coming-soon">
            {currentToken} futures coming soon...
          </div>
        )}
    </div>
  );
};

export default FutureContainer;
