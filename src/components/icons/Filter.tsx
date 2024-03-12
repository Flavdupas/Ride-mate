import * as React from "react";
import Svg, { Path } from "react-native-svg";

const FilterIcon = () => (
  <Svg height={35} width={35} fill="none" viewBox="0 0 24 24">
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M3 7a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm3 5a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm3 5a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default FilterIcon;
