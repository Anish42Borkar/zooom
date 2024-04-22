import { useUser } from "@clerk/nextjs";
import {
  Call,
  QueryCallsRequest,
  StreamVideoClient,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { start } from "repl";

export const useGetCalls = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [calls, setCalls] = useState<Call[]>([]);
  const { user } = useUser();
  const client = useStreamVideoClient();

  useEffect(() => {
    const loadCalls = async () => {
      try {
        const { calls } = (await client?.queryCalls({
          sort: [
            {
              field: "starts_at",
              direction: -1,
            },
          ],
          filter_conditions: {
            // starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user?.id },
              { members: { $in: [user?.id] } },
            ],
          },
        })) as {
          calls: Call[];
          duration: string;
          next?: string | undefined;
          prev?: string | undefined;
        };
        console.log(calls, "upcoming");
        setCalls(calls);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCalls();
  }, [client, user?.id]);

  const now = new Date();

  const endedCalls = calls.filter(({ state: { endedAt, startsAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });
  const upcomingCalls = calls.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now;
  });

  return {
    endedCalls,
    upcomingCalls,
    callRecordings: calls,
    isLoading,
  };
};
