import { Action, ActionPanel, closeMainWindow, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import { Account, listAccounts } from "./listAccounts";
import { type } from "./type";

const useData = () => {
  const [data, setData] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  const updateData = async () => {
    setLoading(true);
    try {
      setData(await listAccounts());
    } finally {
      setLoading(false);
    }
  }
  useInterval(() => void updateData(), 1000);
  useEffect(() => void updateData(), []);

  return { data, loading };
}

export default function SlackList() {
  const { data, loading } = useData()

  return (
    <List isLoading={ loading } enableFiltering={ true } isShowingDetail={true}
          searchBarPlaceholder="Search YubiKey..." throttle>
      <List.Section title="Results">
        { ( data ?? [] ).map((entry) => (
          <AccountDetail key={ `${ entry.account }_${ entry.title }` } account={ entry }/>
        )) }
      </List.Section>
    </List>
  );
}

function AccountDetail({ account }: { account: Account }) {
  return (
    <List.Item
      title={ account.title }
      subtitle={ account.account }
      icon={ { source: Icon.Key } }
      detail={<List.Item.Detail markdown={account.code}/>}
      actions={ (
        <ActionPanel>
          <ActionPanel.Section>
            <Action title="Type" onAction={ async () => {
              await closeMainWindow();
              type(account.code)
            } }/>
            <Action.CopyToClipboard title="Copy" content={ account.code }/>
          </ActionPanel.Section>
        </ActionPanel>
      ) }
    />
  );
}
