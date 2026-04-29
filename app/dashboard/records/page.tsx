import { RecordsContent } from "@/components/records/records-content"
import { getRecordsLeaderboards } from "@/lib/records/get-records-leaderboards"

export const revalidate = 60 * 60 * 3

export default async function RecordsPage() {
  const leaderboards = await getRecordsLeaderboards()

  return <RecordsContent leaderboards={leaderboards} />
}