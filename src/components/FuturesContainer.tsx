import React, { useEffect, useState } from "react";
import useContracts from "../hooks/useContracts";
import { useStoreState } from "../store/globalStore";
import Future from "./Future";

const FutureContainer: React.FunctionComponent = () => {
  const { currentToken, web3 } = useStoreState((state) => state);
  const { getFuturesList, getUnderlyingAddress } = useContracts();

  const [sevenDayFutures, set7DayFutures] = useState<any>([]);
  const [thirtyDayFutures, set30DayFutures] = useState<any>([]);
  const [ninetyDayFutures, set90DayFutures] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const underlyingToken = getUnderlyingAddress();

      const sevenDayFutures = await getFuturesList(underlyingToken, 5760 * 7);
      set7DayFutures(sevenDayFutures);

      const thirtyDayFutures = await getFuturesList(underlyingToken, 5760 * 30);
      set30DayFutures(thirtyDayFutures);

      const ninetyDayFutures = await getFuturesList(underlyingToken, 5760 * 90);
      set90DayFutures(ninetyDayFutures);

      setLoading(false);
    };

    web3 && fetchData();

    // eslint-disable-next-line
  }, [currentToken, web3]);

  return (
    <div className="futures-container">
      {loading ? (
        <div className="coming-soon">loading...</div>
      ) : (
        <>
          {sevenDayFutures.map((future: any, index: number) => (
            <Future
              key={index}
              duration={7}
              futureID={index}
              futureAddress={future}
            />
          ))}

          {thirtyDayFutures.map((future: any, index: number) => (
            <Future
              key={index}
              duration={30}
              futureID={index}
              futureAddress={future}
            />
          ))}

          {ninetyDayFutures.map((future: any, index: number) => (
            <Future
              key={index}
              duration={90}
              futureID={index}
              futureAddress={future}
            />
          ))}
        </>
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
