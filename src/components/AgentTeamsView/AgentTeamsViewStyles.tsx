import { Button } from "@twilio/flex-ui";
import styled from "react-emotion";

export const FilterButton = styled(Button)`
  border: 1px solid rgb(198, 202, 215);
  border-radius: 0;
  align-items: center;
  align-self: center;
  padding: 16px 8px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 1px;
  justify-content: space-between;
  display: flex;
`

export const FilterButtonLabel = styled('span')`
  display: inline-block;
  padding-right: 16px;
`

export const TableHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 8px;
`