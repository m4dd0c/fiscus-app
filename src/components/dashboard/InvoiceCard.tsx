import { FaArrowRightLong } from "react-icons/fa6";

export interface iInvoice {
  sourceUsername: string;
  destinationUsername: string;
  amount: number;
  transferId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  createdAt: string;
}

export const InvoiceCard = ({
  sourceUsername,
  destinationUsername,
  amount,
  transferId,
  sourceAccountId,
  destinationAccountId,
  createdAt,
}: iInvoice) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex font-bold max-sm:text-lg text-xl items-center justify-start gap-4 my-1">
          <h1>{sourceUsername}</h1>
          <FaArrowRightLong size={16} color="skyblue" />
          <h1>{destinationUsername}</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="h-fit">
        <p title="TransferId" className="text-sm text-muted-foreground">
          {transferId.slice(transferId.lastIndexOf("/") + 1)}
        </p>
      </div>
      <hr className="my-3 block" />

      <div className="flex flex-col items-center my-5 space-y-1">
        <p className="text-muted-foreground" title="Source AccountId">
          {sourceAccountId}
        </p>
        <div className="flex flex-col items-center relative h-28 w-full">
          <span className="block h-20 rounded-sm w-1 bg-blue-500" />
          <h2 className="absolute bg-background top-6 text-2xl font-bold text-green-500">
            ${amount}
          </h2>
          <div className="justify-center items-center flex">
            <span className="absolute bottom-2 rounded-sm left-1/2 translate-x-[7px] block w-1 h-7 bg-blue-500 rotate-45" />
            <span className="absolute bottom-2 rounded-sm right-1/2 -translate-x-[7px] block w-1 h-7 bg-blue-500 -rotate-45" />
          </div>
        </div>
        <p className="text-muted-foreground" title="destination AccountId">
          {destinationAccountId}
        </p>
      </div>
    </div>
  );
};
