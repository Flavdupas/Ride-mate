import * as React from "react"
import Svg, { Path } from "react-native-svg"

const HockeyIcon = () => (
  <Svg
    width={800}
    height={800}
    viewBox="0 0 24 24"
  >
    <Path d="M12 5C6.5 5 2 6.6 2 8.5S6.5 12 12 12s10-1.6 10-3.5S17.5 5 12 5M2 11.8v4.7C2 18.4 6.5 20 12 20s10-1.6 10-3.5v-4.7a8.17 8.17 0 0 1-2.3 1.1A25.06 25.06 0 0 1 12 14a25.06 25.06 0 0 1-7.7-1.1A12.29 12.29 0 0 1 2 11.8Z" />
    <Path fill="none" d="M0 0h24v24H0z" />
  </Svg>
)
export default HockeyIcon;
