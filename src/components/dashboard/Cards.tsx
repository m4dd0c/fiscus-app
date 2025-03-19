import { CiBank } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";

export const SummaryCard = ({
  title,
  balance,
  icon,
}: {
  title: string;
  balance: string;
  icon: React.JSX.Element;
}) => {
  return (
    <div className="h-24 border rounded-lg space-y-2 p-4">
      <div className="flex justify-between uppercase opacity-70 items-center text-sm font-semibold">
        <h1>{title}</h1>
        {icon}
      </div>
      <h1 className="text-xl font-semibold tracking-wide">
        ${(+balance).toLocaleString()}
      </h1>
    </div>
  );
};
export const AlertCard = ({ data }: any) => {
  return (
    <div className="text-md p-4 border flex justify-between rounded-lg items-center">
      <div className="flex justify-center items-center gap-5">
        <div className="rounded-full bg-gray-800 size-10 grid place-items-center">
          {data.icon}
        </div>
        <div>
          <h1 className="font-semibold">{data.title}</h1>
          <h1 className="opacity-70 text-sm">{data.desc}</h1>
        </div>
      </div>
      <button>
        <FaTimes size={12} />
      </button>
    </div>
  );
};

export const AccountDetail = ({ data }: any) => {
  return (
    <div className="text-md p-4 border flex justify-between rounded-lg items-center">
      <div className="flex gap-3 items-center">
        <div className="rounded-full bg-gray-800 size-10 grid place-items-center">
          <CiBank size={25} />
        </div>
        <div className=" text-xl font-semibold tracking-tight">
          <h1>{data.name}</h1>
          <h1 className="text-sm opacity-60">{data.subtype}</h1>
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold tracking-tight">balance</div>
        <div className="text-2xl font-semibold">
          ${(+data.balances.current).toLocaleString()}
        </div>
      </div>
    </div>
  );
};
