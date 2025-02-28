import React from "react";

const AccountCard = ({ account }: any) => {
  return (
    <div className="bg-gradient-to-tl from-gray-900 to-gray-800 text-white h-56 w-96 p-6 rounded-xl shadow-md flex flex-col justify-between">
      <div className=" text-xl font-semibold tracking-tight">
        <h1>
          {account.name}
          <span className="text-sm opacity-60" title={account.subtype}>
            &nbsp;&nbsp;{account.subtype.split(" ")[0]}
          </span>
        </h1>
        <span className="text-sm opacity-60">{account.account_id}</span>
      </div>

      <div className="inline-block w-12 h-8 bg-gradient-to-tl from-yellow-200 to-yellow-100 rounded-md shadow-inner overflow-hidden">
        <div className="relative w-full h-full grid grid-cols-2 gap-1">
          <div className="absolute border border-gray-900 rounded w-4 h-6 left-4 top-1"></div>
          <div className="border-b border-r border-gray-900 rounded-br"></div>
          <div className="border-b border-l border-gray-900 rounded-bl"></div>
          <div className=""></div>
          <div className=""></div>
          <div className="border-t border-r border-gray-900 rounded-tr"></div>
          <div className="border-t border-l border-gray-900 rounded-tl"></div>
        </div>
      </div>

      <div className="">
        <div className="text-xs font-semibold tracking-tight">balance</div>

        <div className="text-2xl font-semibold">
          ${(+account.balances.current).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
