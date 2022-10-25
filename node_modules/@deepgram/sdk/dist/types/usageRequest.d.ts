import { UsageCallback } from "./usageCallback";
import { UsageRequestDetail } from "./usageRequestDetail";
import { UsageRequestMessage } from "./usageRequestMessage";
export declare type UsageRequest = {
    request_id: string;
    created: string;
    path: string;
    accessor: string;
    response?: UsageRequestDetail | UsageRequestMessage;
    callback?: UsageCallback;
};
