import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ClosedCaptionOutlinedIcon from "@mui/icons-material/ClosedCaptionOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import { styled, useTheme } from "@mui/material/styles";

import {
  Autocomplete,
  AppBar,
  Avatar,
  Box,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArgusStyles } from "../../../../infrastructure";
import { programAvailability } from "./programData";

import { DateTime } from "luxon";
import { useLocation, useParams } from "react-router-dom";

import {
  IQDataGrid,
  IQIcon,
  IQPageContent,
  IQ_ICONS,
  PageHeaderWithCrumbs,
} from "../../../../components";

import { bpsFormatter, getServerBaseUri } from "nga-js-functions-common";

import {
  FOOTER_OFFSET,
  PAGE_OFFSET_FILTERS,
  currentDateTimeFormattedSecs,
  currentDateTimeFormattedTimeOnly,
  getUserTimeZoneTime,
  timeStampToString,
} from "../../../../utilities";

import {
  BucketCard,
  BucketCardHeader,
  BucketCardRow,
  BucketCardRowsStats,
  BucketCardTimeCompare,
  FixedTimeWindow,
  RenderInfo,
  RenderMetrics,
  RenderMetricsNoAggregate,
  RenderMetricsWithTitle,
  RenderSingleMetric,
} from "../shared";

import { useAxios } from "../../../../infrastructure/data/useAxios";

import useWindowSize, {
  calculateHeightPx,
} from "../../../../utilities/useWindowSize";

import { getMediaInventoryById } from "../../../../infrastructure/data/apis/media-inventory-apis";
// import { getSensors } from "../../../../infrastructure/data/apis/sensor-manager-apis";
import { getAvailabilityByProgram } from "../../../../infrastructure/data/apis/availability-collector-apis";
import { getMetricsByProgram } from "../../../../infrastructure/data/apis/metrics-collector-apis";
import {
  getAggAlarmHistory,
  getAggEventHistory,
} from "../../../../infrastructure/data/apis/program-integrator-alarm-apis";
import {
  getHistory,
  getProgramStatusSummary,
  getProgramThumbnails,
  getProgramBigThumbnail,
} from "../../../../infrastructure/data/apis/program-integrator-apis";

import {
  getAlarmLog,
  getAlarmLogCount,
  getEventLog,
  getEventLogCount,
} from "../../../../infrastructure/data/apis/event-monitor-apis";

import { iqColorPalette } from "../../../../utilities";
import AvailabilityChart from "../shared/AvailabilityChart";
import HistoryChicklets from "../shared/HistoryChicklets";
import { ArgusContext } from "../../../../context";
import "./../Common.css";
import "./ProgramDetails.css";

const alarmStateBgColorMap = {
  Healthy: iqColorPalette.status.bg.green,
  Warning: iqColorPalette.status.bg.orange,
  Critical: iqColorPalette.status.bg.red,
  Outage: iqColorPalette.status.bg.black,
  Info: iqColorPalette.status.bg.gray,
};

const MEDIA_VIEW = {
  NONE: "summary",
  VIDEO: "video",
  AUDIO: "audio",
  SUMMARY: "summary",
  DETAILS: "details",
  AVAILABILITY: "availability",
  KEYMETRICS: "keyMetrics",
};
// const PID_TYPES = {
//   "ITS-TBLPID": "PAT",
//   "ITS-VPID": "Video",
//   "ITS-APID": "Audio",
// };

const QUALITY_SCORE = {
  vBufOvrFlow: "Video Buffer Overflow",
  vBufUndrFlow: "Video Buffer Underflow",
  vPidDrpOut: "Video PID Dropout",
  vPktLoss: "Video Packet Loss",
  vSyntxErr: "Video Syntax Error",
  vPESErr: "Video PES Error",
  aBufOvrFlow: "Audio Buffer Overflow",
  aBufUndrFlow: "Audio Buffer Underflow",
  aPidDrpOut: "Audio PID Dropout",
  aPktLoss: "Audio Packet Loss",
  aSyntxErr: "Audio Syntax Error",
  aPESErr: "Audio PES Error",
  flowDrpOut: "Flow Dropout",
};

const getContentAreaHeight = (height) => {
  return calculateHeightPx(height - PAGE_OFFSET_FILTERS - FOOTER_OFFSET);
};

const CustomAvatar = ({
  backgroundColor,
  icon: IconComponent,
  iconColor,
  label,
}) => (
  <Avatar sx={{ backgroundColor, width: "30px", height: "30px" }}>
    <IconComponent sx={{ color: iconColor, fontSize: "16px" }} />
  </Avatar>
);

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  paddingTop: "40px",
}));

const MainContainer = styled("div")({
  display: "flex",
});

const AppBarContainer = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerContainer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const UpdateEveryInterval = (props) => {
  const globalStyles = ArgusStyles();
  const classes = useStyles();
  const { callbackFunction } = props;
  const { getI18nString } = useContext(ArgusContext);

  const updateEveryList = {
    "15 Sec": 15,
    "30 Sec": 30,
    "1 Min": 60,
    Disable: "Disabled",
  };
  const [updateEvery, setUpdateEvery] = useState(15);
  const handleUpdateEvery = (event, newEvent) => {
    callbackFunction(updateEveryList[newEvent]);
    setUpdateEvery(updateEveryList[newEvent]);
  };

  return (
    <Grid container direction="row" alignItems="center" spacing={2}>
      <Grid item>
        <Typography>
          <span className={classes.label}>
            {getI18nString("ivmsasm.common.updateEvery")}
          </span>
        </Typography>
      </Grid>
      <Grid item>
        <Autocomplete
          id="updateEvery"
          value={
            updateEvery !== "Disabled"
              ? updateEvery > 59
                ? `${updateEvery / 60} Min`
                : `${updateEvery} Sec`
              : `${updateEvery}`
          }
          options={Object.keys(updateEveryList)}
          classes={{
            inputRoot: classes.inputRoot,
            option: classes.option,
            root: classes.root,
          }}
          getOptionLabel={(option) => option}
          onChange={handleUpdateEvery}
          disableClearable
          ListboxProps={{
            className: globalStyles.scrollTimeWindow,
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              style={{ width: 100, fontSize: "13px" }}
              variant="standard"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

const ProgramDetails = (props) => {
  const classes = useStyles();
  const [, windowHeight] = useWindowSize();
  const headerOffset = 100;
  const axios = useAxios();
  const { timezoneOffset, timezoneString } = useContext(ArgusContext);
  const newDate = new Date();
  const browserTzOffset = newDate.getTimezoneOffset() * -60000;
  const tzOffset = timezoneOffset + browserTzOffset;
  const { id } = useParams();
  const { programid } = useParams();
  const { hash } = useLocation();
  // const { theme } = props;
  const globalStyles = ArgusStyles();
  const [style, setStyle] = useState("widthWide");
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const handleDrawerOpen = () => {
    setOpen(true);
    setStyle("widthNarrow");
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setStyle("widthWide");
  };
  const [intervalId, setIntervalId] = useState(null);
  // default to 15 secs based on default 15 min interval
  const [refreshInterval, setRefreshInterval] = useState(15);

  const [categories, setCategories] = useState([
    "CONTENT-VIDEO",
    "CONTENT-AUDIO",
    "CONTENT-CC",
    "CONTENT-ADS",
    "CONTENT-OTHER",
  ]);
  // const navigate = useNavigate();

  const [flow, setFlow] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [selectedMediaView, setSelectedMediaView] = useState(
    MEDIA_VIEW.SUMMARY
  );
  // const [selectedMetricsView, setSelectedMetricsView] = useState("");
  const [programState, setProgramState] = useState("");
  const [flowState, setFlowState] = useState("");
  const [alarmState, setAlarmState] = useState([]);
  const [flowTemplate, setFlowTemplate] = useState("");
  const [programTemplate, setProgramTemplate] = useState("");

  const [, setSelectedJS] = useState(null);
  const [pgmVideo, setPgmVideo] = useState();
  const [pgmAudio, setPgmAudio] = useState();

  // Alarms and Events
  const [alarmHistory, setAlarmHistory] = useState([]);
  const [eventHistory, setEventHistory] = useState([]);
  const [availabilityHistory, setAvailabilityHistory] = useState([]);
  const [alarmCount, setAlarmCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [alarmPageNumber, setAlarmPageNumber] = useState(1);
  const [eventPageNumber, setEventPageNumber] = useState(1);
  const [isAlarmsLoading, setIsAlarmsLoading] = useState(true);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [alarmRows, setAlarmRows] = useState([]);
  const [eventRows, setEventRows] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [events, setEvents] = useState([]);
  const { getCodaI18nString } = useContext(ArgusContext);
  const [programVideoAvailabilityRT, setProgramVideoAvailabilityRT] = useState(
    []
  );
  const [programAudioAvailabilityRT, setProgramAudioAvailabilityRT] = useState(
    []
  );
  const [videoAlarmHistoryChart, setVideoAlarmHistoryChart] = useState([]);
  const [audioAlarmHistoryChart, setAudioAlarmHistoryChart] = useState([]);
  const [videoEventHistoryChart, setVideoEventHistoryChart] = useState([]);
  const [audioEventHistoryChart, setAudioEventHistoryChart] = useState([]);
  const [programThumbnails, setProgramThumbnails] = useState([]);
  const [programBigThumbnail, setProgramBigThumbnail] = useState([]);

  const [filters, setFilters] = useState({
    entityId: `${programid}${hash}`,
    entityType: "ITS-PGM",
    contentType: "", // Future
    startTime: null,
    endTime: null,
    agg: "15s", // default to last 15 minutes of live data.
    interval: 15, // in minutes
    rt: true, // real time flag
    incChildren: true, // default to true.
  });

  const getAggAlarmHistoryData = () => {
    if (
      typeof axios !== "undefined" &&
      filters.startTime !== null &&
      filters.endTime !== null
    ) {
      getAggAlarmHistory(
        axios,
        filters.entityId,
        filters.startTime,
        filters.endTime,
        filters.agg,
        "CONTENT-VIDEO"
      ).then((data) => {
        //debugger;
        setVideoAlarmHistoryChart(data);
      });
      getAggAlarmHistory(
        axios,
        filters.entityId,
        filters.startTime,
        filters.endTime,
        filters.agg,
        "CONTENT-AUDIO"
      ).then((data) => {
        //debugger;
        setAudioAlarmHistoryChart(data);
      });
    }
  };

  const getAggEventHistoryData = () => {
    if (
      typeof axios !== "undefined" &&
      filters.startTime !== null &&
      filters.endTime !== null
    ) {
      getAggEventHistory(
        axios,
        filters.entityId,
        filters.startTime,
        filters.endTime,
        filters.agg,
        "CONTENT-VIDEO"
      ).then((data) => {
        //debugger;
        setVideoEventHistoryChart(data);
      });
      getAggEventHistory(
        axios,
        filters.entityId,
        filters.startTime,
        filters.endTime,
        filters.agg,
        "CONTENT-AUDIO"
      ).then((data) => {
        //debugger;
        setAudioEventHistoryChart(data);
      });
    }
  };

  const getVideoAvailabilityData = () => {
    if (
      typeof axios !== "undefined" &&
      filters.startTime !== null &&
      filters.endTime !== null
    ) {
      getAvailabilityByProgram(
        axios,
        filters.entityId,
        filters.startTime,
        filters.endTime,
        filters.agg,
        "CONTENT-VIDEO"
      ).then((data) => {
        //debugger;
        // console.log("updated", filters.startTime, filters.endTime)
        setProgramVideoAvailabilityRT(data);
      });
    }
  };

  const getAudioAvailabilityData = () => {
    if (
      typeof axios !== "undefined" &&
      filters.startTime !== null &&
      filters.endTime !== null
    ) {
      getAvailabilityByProgram(
        axios,
        filters.entityId,
        filters.startTime,
        filters.endTime,
        filters.agg,
        "CONTENT-AUDIO"
      ).then((data) => {
        //debugger;
        setProgramAudioAvailabilityRT(data);
      });
    }
  };

  const dynamicSort = (property) => {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  };

  const getHistoryWindowData = () => {
    if (
      typeof axios !== "undefined" &&
      filters.startTime !== null &&
      filters.endTime !== null
    ) {
      getHistory(
        axios,
        filters.entityId,
        filters.startTime,
        filters.endTime,
        filters.agg,
        false
      ).then((dataAvailability) => {
        //debugger;
        dataAvailability.data.availability.sort(dynamicSort("ts"));
        setAvailabilityHistory(dataAvailability.data.availability);
      });
      getHistory(
        axios,
        filters.entityId,
        filters.startTime,
        filters.endTime,
        filters.agg,
        true
      ).then((data) => {
        //debugger;
        setAlarmHistory(data.data.alarms);
        setEventHistory(data.data.events);
      });
    }
  };

  const getProgramThumbnailsData = () => {
    if (
      typeof axios !== "undefined" &&
      filters.startTime !== null &&
      filters.endTime !== null
    ) {
      getProgramThumbnails(
        axios,
        filters.entityId,
        filters.startTime,
        filters.endTime,
        filters.agg
      ).then((data) => {
        //debugger;
        setProgramThumbnails(data.data.thumbnails);
      });
    }
  };

  const getProgramThumbnailData = () => {
    if (typeof axios !== "undefined" && filters.endTime !== null) {
      getProgramBigThumbnail(axios, filters.entityId, filters.startTime).then(
        (data) => {
          //debugger;
          console.log(data);
          setProgramBigThumbnail(data.data.thumbnail.url);
        }
      );
    }
  };

  const getProgramStatusData = () => {
    if (
      typeof axios !== "undefined" &&
      filters.startTime !== null &&
      filters.endTime !== null
    ) {
      // let now = new Date();
      // now = timeStampToString(
      //   now,
      //   timezoneString,
      //   "MMM dd, HH:mm:ss",
      //   timezoneOffset
      // );
      // let startTime = timeStampToString(
      //   filters.startTime * 1000,
      //   timezoneString,
      //   "MMM dd, HH:mm:ss",
      //   timezoneOffset
      // );
      // let endTime = timeStampToString(
      //   filters.endTime * 1000,
      //   timezoneString,
      //   "MMM dd, HH:mm:ss",
      //   timezoneOffset
      // );
      // console.log("Program Status Summary: ", now, ":", startTime, endTime)
      getProgramStatusSummary(
        axios,
        filters.entityId,
        filters.startTime,
        filters.endTime,
        filters.agg,
        filters.incChildren
      ).then((data) => {
        setProgramState(data.data.status.programAlarmSeverity);
        setFlowState(data.data.status.flowAlarmSeverity);
        setAlarmState(data.data.status.status);
        setFlowTemplate(data.data.status.flowTemplateId);
        setProgramTemplate(data.data.status.programTemplateId);
      });
    }
  };

  const buildAlarmColumns = (origData, categories) => {
    if (filters.startTime !== null && filters.endTime !== null) {
      if (origData === undefined) {
        return <div></div>;
      }

      // Group the alarms by content type value
      const dataGroups = categories.reduce((acc, category) => {
        const filteredData = origData.filter(
          (item) => item.contentType === category
        );
        return { ...acc, [category]: filteredData };
      }, {});

      // Determine the max number of rows needed for display purposes
      const numOfRows = Object.keys(dataGroups)
        .map((category) => Math.ceil(dataGroups[category].length))
        .reduce((acc, value) => Math.max(acc, value), 0);

      return (
        <div key={`alarmColumns`}>
          {[...Array(numOfRows)].map((_, rowIndex) => (
            <Grid
              container
              className="ProgramStatusAddPadding"
              key={`alarm-${rowIndex}`}
            >
              {categories.map((category) => {
                const dataGroup = dataGroups[category];
                const data = dataGroup[rowIndex];

                return data ? (
                  <Grid item xs={2.4}>
                    <div
                      className={`ProgramStatusStreamInfo ${globalStyles.addGridlines}`}
                    >
                      <Tooltip title={data.eventDefId}>
                        <span
                          style={{
                            color: alarmStateBgColorMap[data.severity],
                            fontSize: "12px",
                          }}
                        >
                          {data.name}
                        </span>
                      </Tooltip>
                    </div>
                  </Grid>
                ) : (
                  <Grid item xs={2.4}></Grid>
                );
              })}
            </Grid>
          ))}
        </div>
      );
    }
  };

  const handleUpdateFilters = (updatedFilters) => {
    if (!updatedFilters.rt) {
      setRefreshInterval("Disabled");
    } else {
      setRefreshInterval(15);
    }
    setFilters(updatedFilters);
  };

  const setCurrentTimeFilters = () => {
    let endDate = new Date();
    // endDate.setSeconds(0);
    endDate.setMilliseconds(0);
    let startDate = new Date(endDate);
    startDate.setMinutes(startDate.getMinutes() - filters.interval);
    let loadFilters = {
      ...filters,
      startTime: startDate.getTime() / 1000,
      endTime: endDate.getTime() / 1000,
    };
    setFilters(loadFilters);
    // console.log("Live Time Range: ", startDate.getTime() / 1000, ':', endDate.getTime() / 1000);
  };

  const refreshIntervalChanged = (updateEvery) => {
    if (updateEvery !== "Disabled") {
      setCurrentTimeFilters();
    }
    setRefreshInterval(updateEvery);
  };

  useEffect(() => {
    getAlarms();
  }, [alarmPageNumber]);

  useEffect(() => {
    getEvents();
  }, [eventPageNumber]);

  const refreshData = () => {
    getHistoryWindowData(); // Data for chicklets (common for all 4 tabs)
    getAggAlarmHistoryData(); // Data for Details Tab - Video and Audio Alarm History Chart
    getAggEventHistoryData(); // Data for Details Tab - Video and Audio Event History Chart
    getVideoAvailabilityData(); // Data for Availability Tab - Video Availability Chart
    getAudioAvailabilityData(); // Data for Availability Tab - Audio Availability Chart
    getProgramStatusData(); // Data for Program status on top right (common for all 4 tabs)
    getProgramThumbnailsData(); // Data For thumbnail Gallery (common for all 4 tabs)
    getProgramThumbnailData(); // Data for single prominent thumb on top (common for all 4 tabs)
    getAlarms();
    getEvents();
    // console.log("refreshData: startTime: ", timeStampToString(
    //     filters.startTime * 1000,
    //     timezoneString,
    //     "MMM dd, HH:mm:ss",
    //     timezoneOffset));
  };

  const getProgramMetrics = () => {
    getMetricsByProgram(axios, `${programid}${hash}`).then((data) => {
      setMetrics(data.data.metrics[0]);
    });
  };

  const getAllVideoMetrics = () => {
    metrics &&
      setPgmVideo(
        metrics?.tsMetric?.tsPgmMetric?.pids.filter(
          (f) => f.tsPidMetric.pidType === "ITS-VPID"
        )
      );
  };

  const getAllAudioMetrics = () => {
    metrics &&
      setPgmAudio(
        metrics?.tsMetric?.tsPgmMetric?.pids.filter(
          (f) => f.tsPidMetric.pidType === "ITS-APID"
        )
      );
  };

  const getFlow = () => {
    getMediaInventoryById(axios, id).then((data) => {
      setFlow(data.data.inventoryObject);
    });
  };

  // const getSensor = useCallback(() => {
  //   getSensors(axios, "")
  //     .then((data) => {
  //       if (data.data.sensors.length > 0) {
  //         setSensor(data.data.sensors[0]);
  //       } else {
  //         setSensor(null);
  //       }
  //     })
  //     .catch((ex) => {
  //       setSensor(null);
  //       console.error(ex);
  //     });
  // }, [axios]);

  const handleAlarmPageChange = (pageNumber) => {
    setAlarmPageNumber(1 + pageNumber);
  };

  const handleEventPageChange = (pageNumber) => {
    setEventPageNumber(1 + pageNumber);
  };

  const getAlarms = () => {
    if (
      typeof axios !== "undefined" &&
      filters.startTime !== null &&
      filters.endTime !== null
    ) {
      // Make the API call
      getAlarmLogCount(
        axios,
        filters.entityId,
        filters.entityType,
        filters.startTime,
        filters.endTime,
        filters.incChildren,
        rowsPerPage
      )
        .then((data) => {
          if (data.data.count) {
            setAlarmCount(data.data.count);
          }
        })
        .catch((err) => {
          console.error(err);
        });
      getAlarmLog(
        axios,
        filters.entityId,
        filters.entityType,
        filters.startTime,
        filters.endTime,
        filters.incChildren,
        alarmPageNumber,
        rowsPerPage
      )
        .then((data) => {
          let alarms = [];
          if (data.data.log) {
            alarms = data.data.log;
          }
          setAlarms(alarms);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsAlarmsLoading(false);
        });
    }
  };

  const getEvents = () => {
    if (
      typeof axios !== "undefined" &&
      filters.startTime !== null &&
      filters.endTime !== null
    ) {
      // Make the API call
      getEventLogCount(
        axios,
        filters.entityId,
        filters.entityType,
        filters.startTime,
        filters.endTime,
        filters.incChildren,
        rowsPerPage
      )
        .then((data) => {
          if (data.data.count) {
            setEventCount(data.data.count);
          }
        })
        .catch((err) => {
          console.error(err);
        });
      getEventLog(
        axios,
        filters.entityId,
        filters.entityType,
        filters.startTime,
        filters.endTime,
        filters.incChildren,
        eventPageNumber,
        rowsPerPage
      )
        .then((data) => {
          let events = [];
          if (data.data.log) {
            events = data.data.log;
          }
          setEvents(events);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsEventsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (axios) {
      getFlow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axios]);

  useEffect(() => {
    getAlarmRows();
    getEventRows();
  }, [alarms, events]);

  useEffect(() => {
    if (axios) {
      getProgramMetrics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow]);

  useEffect(() => {
    getAllVideoMetrics();
    getAllAudioMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics]);

  useEffect(() => {
    if (intervalId) {
      // console.log("refreshInterval: stop timer: ", intervalId);
      clearInterval(intervalId);
      setIntervalId(null);
    }
    if (refreshInterval !== "Disabled") {
      const timerId = setInterval(() => {
        setCurrentTimeFilters();
      }, refreshInterval * 1000);
      // console.log("refreshInterval: start timer: ", timerId);
      setIntervalId(timerId);
    }
    return () => {
      if (intervalId) {
        // console.log("refreshInterval: clear timer: unmount ", intervalId);
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [refreshInterval]);

  useEffect(() => {
    refreshData();
  }, [filters]);

  const MEDIA_VIEW_PANELS = {
    summary: [
      {
        render: (wrapperKey) => (
          <BucketCard
            status="InfoBox"
            label={getCodaI18nString("codats.alarm.log")}
            key="ALARM-LOG"
          >
            <div style={{ height: "300px" }}>
              <IQDataGrid
                rows={alarmRows}
                columns={alarmColumns}
                rowCount={alarmCount}
                pageSize={rowsPerPage}
                loading={isAlarmsLoading}
                paginationMode="server"
                checkboxSelection={false}
                disableSelectionOnClick
                onPageChange={handleAlarmPageChange}
              />
            </div>
          </BucketCard>
        ),
        row: 2,
        column: 1,
        colWidth: 2,
      },
      {
        render: (wrapperKey) => (
          <BucketCard
            status="InfoBox"
            label={getCodaI18nString("codats.event.log")}
            key="EVENT-LOG"
          >
            <div style={{ height: "300px" }}>
              <IQDataGrid
                rows={eventRows}
                columns={eventColumns}
                rowCount={eventCount}
                pageSize={rowsPerPage}
                loading={isEventsLoading}
                paginationMode="server"
                checkboxSelection={false}
                disableSelectionOnClick
                onPageChange={handleEventPageChange}
              />
            </div>
          </BucketCard>
        ),
        row: 3,
        column: 1,
        colWidth: 2,
      },
      {
        render: (wrapperKey) => renderProgramSummaryInfo(wrapperKey),
        row: 4,
        column: 1,
        colWidth: 1,
      },
      {
        render: (wrapperKey) =>
          pgmVideo[0].tsPidMetric.vidObj.drFrmt &&
          pgmVideo &&
          pgmVideo.map((video, index) => (
            <RenderInfo
              key={wrapperKey}
              title={`${getCodaI18nString("codats.video.pidNum")} ${
                video.tsPidMetric.pidNum
              }`}
              data={[
                {
                  label: getCodaI18nString("codats.video.drClrPri"),
                  data:
                    video.tsPidMetric.vidObj.drClrPri !== ""
                      ? video.tsPidMetric.vidObj.drClrPri
                      : "-",
                },
                {
                  label: getCodaI18nString("codats.video.drTrFn"),
                  data:
                    video.tsPidMetric.vidObj.drTrFn !== ""
                      ? video.tsPidMetric.vidObj.drTrFn
                      : "-",
                },
                {
                  label: getCodaI18nString("codats.video.PrTrFn"),
                  data: video.tsPidMetric.vidObj.PrTrFn
                    ? video.tsPidMetric.vidObj.PrTrFn
                    : "-",
                },
                {
                  label: getCodaI18nString("codats.video.drMatCoeff"),
                  data:
                    video.tsPidMetric.vidObj.drMatCoeff !== ""
                      ? video.tsPidMetric.vidObj.drMatCoeff
                      : "-",
                },
                {
                  label: getCodaI18nString("codats.video.drMaxCll"),
                  data:
                    video.tsPidMetric.vidObj.drMaxCll !== ""
                      ? video.tsPidMetric.vidObj.drMaxCll
                      : "-",
                },
                {
                  label: getCodaI18nString("codats.video.drMaxFall"),
                  data:
                    video.tsPidMetric.vidObj.drMaxFall !== ""
                      ? video.tsPidMetric.vidObj.drMaxFall
                      : "-",
                },
                {
                  label: getCodaI18nString("codats.video.drFrmt"),
                  data:
                    video.tsPidMetric.vidObj.drFrmt !== ""
                      ? video.tsPidMetric.vidObj.drFrmt
                      : "-",
                },
              ]}
            />
          )),
        row: 4,
        column: 1,
        colWidth: 1,
      },
      {
        render: (wrapperKey) =>
          pgmAudio &&
          pgmAudio.map((audio, index) => (
            <RenderInfo
              title={`${getCodaI18nString("codats.audio.info")} ${
                audio.tsPidMetric.pidNum
              }`}
              key={`${wrapperKey}${index}`}
              data={[
                {
                  label: getCodaI18nString("codats.audio.codec"),
                  data: audio.tsPidMetric.audObj?.codec,
                },
                {
                  label: getCodaI18nString("codats.audio.numChs"),
                  data: audio.tsPidMetric.audObj?.channels,
                },
                {
                  label: getCodaI18nString("codats.audio.bitDepth"),
                  data: audio.tsPidMetric.audObj?.bitDepth,
                },
                {
                  label: getCodaI18nString("codats.audio.chsMode"),
                  data: audio.tsPidMetric.audObj?.chanMode,
                },
                {
                  label: getCodaI18nString("codats.audio.sampleRate"),
                  data: `${audio.tsPidMetric.audObj?.samprate} Hz`,
                },
                {
                  label: getCodaI18nString("codats.audio.chsConfig"),
                  data: audio.tsPidMetric.audObj?.chanCfg,
                },
              ]}
            />
          )),
        row: 5,
        column: 1,
        colWidth: 1,
      },
    ],
    details: [
      {
        render: (wrapperKey) => (
          <BucketCard
            status="InfoBox"
            label={getCodaI18nString("codats.video.alarm")}
            key="VIDEO-HISTORY"
          >
            <AvailabilityChart
              dataRender={videoAlarmHistoryChart}
              timezone={timezoneOffset}
              titleY0=""
              titleY1=""
              Y0ValueFormat=""
              Y0Min="0"
              Y0Max="20"
              Y1Min="0"
              Y1Max="0"
              theme={theme}
            />
          </BucketCard>
        ),
        row: 1,
        column: 1,
        colWidth: 2,
      },
      {
        render: (wrapperKey) => (
          <BucketCard
            status="InfoBox"
            label={getCodaI18nString("codats.audio.alarm")}
            key="AUDIO-HISTORY"
          >
            <AvailabilityChart
              dataRender={audioAlarmHistoryChart}
              timezone={timezoneOffset}
              titleY0=""
              titleY1=""
              Y0ValueFormat=""
              Y0Min="0"
              Y0Max="20"
              Y1Min="0"
              Y1Max="0"
              theme={theme}
            />
          </BucketCard>
        ),
        row: 1,
        column: 1,
        colWidth: 2,
      },
      {
        render: (wrapperKey) => (
          <BucketCard
            status="InfoBox"
            label={getCodaI18nString("codats.video.event")}
            key="VIDEO-EVENT-HISTORY"
          >
            <AvailabilityChart
              dataRender={videoEventHistoryChart}
              timezone={timezoneOffset}
              titleY0=""
              titleY1=""
              Y0ValueFormat=""
              Y0Min="0"
              Y0Max="20"
              Y1Min="0"
              Y1Max="0"
              theme={theme}
            />
          </BucketCard>
        ),
        row: 1,
        column: 1,
        colWidth: 2,
      },
      {
        render: (wrapperKey) => (
          <BucketCard
            status="InfoBox"
            label={getCodaI18nString("codats.audio.event")}
            key="AUDIO-EVENT-HISTORY"
          >
            <AvailabilityChart
              dataRender={audioEventHistoryChart}
              timezone={timezoneOffset}
              titleY0=""
              titleY1=""
              Y0ValueFormat=""
              Y0Min="0"
              Y0Max="20"
              Y1Min="0"
              Y1Max="0"
              theme={theme}
            />
          </BucketCard>
        ),
        row: 1,
        column: 1,
        colWidth: 2,
      },
    ],
    availability: [
      {
        render: (wrapperKey) => (
          <BucketCard
            status="InfoBox"
            label={getCodaI18nString("codats.video.availStatus")}
            key="AVAIL-HISTORY"
          >
            {programAvailability !== undefined && (
              <>
                <AvailabilityChart
                  dataRender={programVideoAvailabilityRT}
                  timezone={timezoneOffset}
                  titleY0="Availability %"
                  titleY1="Factors Contribution in Seconds"
                  Y0ValueFormat="%"
                  Y0Min="0"
                  Y0Max="100"
                  Y1Min="0"
                  Y1Max="10"
                  theme={theme}
                />
              </>
            )}
          </BucketCard>
        ),
        row: 1,
        column: 1,
        colWidth: 2,
      },
      {
        render: (wrapperKey) => (
          <BucketCard
            status="InfoBox"
            label={getCodaI18nString("codats.audio.avail")}
            key="AVAIL-HISTORY"
          >
            {programAvailability !== undefined && (
              <>
                <AvailabilityChart
                  dataRender={programAudioAvailabilityRT}
                  timezone={timezoneOffset}
                  titleY0="Availability %"
                  titleY1="Factors Contribution in Seconds"
                  Y0ValueFormat="%"
                  Y0Min="0"
                  Y0Max="100"
                  Y1Min="0"
                  Y1Max="10"
                  theme={theme}
                />
              </>
            )}
          </BucketCard>
        ),
        row: 1,
        column: 1,
        colWidth: 2,
      },
    ],
    keyMetrics: [],
  };

  // const renderMetricsDate = () => {
  //   if (metrics) {
  //     return DateTime.fromMillis(metrics.ts * 1000).toLocaleString(
  //       DateTime.DATETIME_SHORT_WITH_SECONDS
  //     );
  //   }
  // };

  const renderProgramPIDTable = (pids, wrapperKey) => {
    if (pids) {
      return (
        <div style={{ paddingTop: "16px" }} key={wrapperKey}>
          <Grid container>
            <Grid item xs={1} sx={{ padding: "0px 8px" }}>
              <Typography variant="body2">
                {getCodaI18nString("codats.pid.label")}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ padding: "0px 8px" }}>
              <Typography variant="body2">
                {getCodaI18nString("codats.pid.type")}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ padding: "0px 8px" }}>
              <Typography variant="body2">
                {getCodaI18nString("codats.pid.codec")}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ padding: "0px 8px" }}>
              <Typography variant="body2">
                {getCodaI18nString("codats.pid.lang")}
              </Typography>
            </Grid>
            <Grid item xs={1} sx={{ padding: "0px 8px" }}>
              <Typography variant="body2">
                {getCodaI18nString("codats.pid.primary")}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ padding: "0px 8px" }}>
              <Typography variant="body2">
                {getCodaI18nString("codats.common.scrambled")}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ padding: "0px 8px" }}>
              <Typography variant="body2">
                {getCodaI18nString("codats.pid.bitRate")}
              </Typography>
            </Grid>

            {pids.map((pid) => (
              <Grid
                container
                key={`programPID-${pid.tsPidMetric.pidNum}`}
                className={globalStyles.addGridlines}
              >
                <Grid item xs={1} sx={{ padding: "3px 8px" }}>
                  <Typography variant="body2">
                    {pid.tsPidMetric.pidNum}
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ padding: "3px 8px" }}>
                  <Typography variant="body2">
                    {pid.tsPidMetric.type}
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ padding: "3px 8px" }}>
                  <Typography variant="body2">
                    {(pid.tsPidMetric.vidObj && pid.tsPidMetric.vidObj.codec) ??
                      (pid.tsPidMetric.audObj && pid.tsPidMetric.audObj.codec)}
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ padding: "3px 8px" }}>
                  <Typography variant="body2">
                    {pid.tsPidMetric.lang !== "" ? pid.tsPidMetric.lang : "-"}
                  </Typography>
                </Grid>

                <Grid item xs={1} sx={{ padding: "3px 8px" }}>
                  <Typography variant="body2">
                    {pid.tsPidMetric.primary ? (
                      <IQIcon
                        iconType={IQ_ICONS.CHECK}
                        //style={{ color: "#000000" }}
                      />
                    ) : (
                      <IQIcon
                        iconType={IQ_ICONS.CLOSE}
                        //style={{ color: "#000000" }}
                      />
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ padding: "3px 8px" }}>
                  <Typography variant="body2">
                    {pid.tsPidMetric.scrambled ? (
                      <IQIcon iconType={IQ_ICONS.CHECK} />
                    ) : (
                      <IQIcon iconType={IQ_ICONS.CLOSE} />
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ padding: "3px 8px" }}>
                  <Typography variant="body2">
                    {bpsFormatter(pid.tsPidMetric.bitrate)}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </div>
      );
    }
  };

  const renderProgramPIDPrimaryTable = (pids) => {
    if (pids) {
      return (
        <div style={{ paddingTop: "16px" }}>
          <Grid container>
            <Grid item xs={4} sx={{ padding: "8px" }}>
              <Typography variant="body2">
                {getCodaI18nString("codats.pid.number")}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ padding: "8px" }}>
              <Typography variant="body2">
                {getCodaI18nString("codats.pid.type")}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ padding: "8px" }}>
              <Typography variant="body2">
                {getCodaI18nString("codats.pid.lang")}
              </Typography>
            </Grid>

            <Grid item xs={2} sx={{ padding: "8px" }}>
              <Typography variant="body2">
                {getCodaI18nString("codats.common.scrambled")}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ padding: "8px" }}>
              <Typography variant="body2">
                {getCodaI18nString("codats.pid.primary")}
              </Typography>
            </Grid>

            {/* {pids.map(pid => ( */}
            <>
              <Grid item xs={4} sx={{ padding: "8px" }}>
                <Typography variant="body2">
                  PID: {pids.tsPidMetric.pidNum}
                </Typography>
              </Grid>
              <Grid item xs={2} sx={{ padding: "8px" }}>
                <Typography variant="body2">
                  {pids.tsPidMetric.type !== "" ? pids.tsPidMetric.type : "-"}
                </Typography>
              </Grid>
              <Grid item xs={2} sx={{ padding: "8px" }}>
                <Typography variant="body2">
                  {pids.tsPidMetric.lang !== "" ? pids.tsPidMetric.lang : "-"}
                </Typography>
              </Grid>

              <Grid item xs={2} sx={{ padding: "8px" }}>
                <Typography variant="body2">
                  {pids.tsPidMetric.scrambled ? (
                    <IQIcon
                      iconType={IQ_ICONS.CHECK}
                      //style={{ color: "#000000" }}
                    />
                  ) : (
                    <IQIcon
                      iconType={IQ_ICONS.CLOSE}
                      //style={{ color: "#000000" }}
                    />
                  )}
                </Typography>
              </Grid>
              <Grid item xs={2} sx={{ padding: "8px" }}>
                <Typography variant="body2">
                  {pids.tsPidMetric.primary ? (
                    <IQIcon
                      iconType={IQ_ICONS.CHECK}
                      style={{ color: "#000000" }}
                    />
                  ) : (
                    <IQIcon
                      iconType={IQ_ICONS.CLOSE}
                      style={{ color: "#000000" }}
                    />
                  )}
                </Typography>
              </Grid>
            </>
            {/* ))} */}
          </Grid>
        </div>
      );
    }
  };
  const renderProgramSummaryInfo = (wrapperKey) => {
    return (
      <BucketCard
        status="Error"
        label={getCodaI18nString("codats.program.info")}
        key={wrapperKey}
      >
        <Grid container>
          <Grid item xs={6}>
            <BucketCardRow
              label={getCodaI18nString("codats.program.label")}
              data={metrics?.tsMetric?.tsPgmMetric?.svcName}
            />
          </Grid>

          <Grid item xs={6}>
            <BucketCardRow
              label={getCodaI18nString("codats.program.tags")}
              data="NA"
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <BucketCardRow
              label={getCodaI18nString("codats.program.channel")}
              data={metrics?.tsMetric?.tsPgmMetric?.pgmNum}
            />
          </Grid>

          <Grid item xs={6}>
            <BucketCardRow
              label={getCodaI18nString("codats.common.scrambled")}
              data={
                metrics?.tsMetric?.tsPgmMetric?.scrambled ? (
                  <IQIcon
                    iconType={IQ_ICONS.CHECK}
                    //style={{ color: "#000000" }}
                  />
                ) : (
                  <IQIcon
                    iconType={IQ_ICONS.CLOSE}
                    //style={{ color: "#000000" }}
                  />
                )
              }
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <BucketCardRow
              label={getCodaI18nString("codats.service.name")}
              data={
                metrics?.tsMetric?.tsPgmMetric?.svcName !== ""
                  ? metrics?.tsMetric?.tsPgmMetric?.svcName
                  : "-"
              }
            />
          </Grid>

          <Grid item xs={6}>
            <BucketCardRow
              label={getCodaI18nString("codats.service.provider")}
              data={
                metrics?.tsMetric?.tsPgmMetric?.svcProvider !== ""
                  ? metrics?.tsMetric?.tsPgmMetric?.svcProvider
                  : "-"
              }
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <BucketCardRow
              label={getCodaI18nString("codats.event.name")}
              data={
                metrics?.tsMetric?.tsPgmMetric?.svcEventName !== ""
                  ? metrics?.tsMetric?.tsPgmMetric?.svcEventName
                  : "-"
              }
            />
          </Grid>
          <Grid item xs={6}>
            <BucketCardRow
              label={getCodaI18nString("codats.event.desc")}
              data={
                metrics?.tsMetric?.tsPgmMetric?.svcEventDesc !== ""
                  ? metrics?.tsMetric?.tsPgmMetric?.svcEventDesc
                  : "-"
              }
            />
          </Grid>
        </Grid>

        <Grid container>
          {" "}
          <Grid item xs={6}>
            {/* <BucketCardRow
              label="Flow"
              data={flow.name}
              addAnchor
              addLink={`/web/react/route/coda/codats/flow/${flow.id}`}
            /> */}
            <BucketCardRow
              label={getCodaI18nString("codats.bitrate.label")}
              data={bpsFormatter(metrics?.tsMetric?.tsPgmMetric?.bitrate)}
            />
          </Grid>
        </Grid>
        {renderProgramPIDTable(
          metrics?.tsMetric?.tsPgmMetric?.pids,
          wrapperKey
        )}
      </BucketCard>
    );
  };

  const _wrapWords = (str) => {
    let newStr = str.split("-");
    let newArr = Object.values(newStr);
    let colNumber = 100 / newArr.length - 0.35;
    return newArr.map((i) => {
      return (
        <span
          style={{
            width: `${colNumber}%`,
            backgroundColor: pgmAudio[0].tsPidMetric.audObj.silentCh
              .split("-")
              .includes(i)
              ? "red"
              : "green",
          }}
          key={`wordWrap${i}`}
        >
          {i}
        </span>
      );
    });
  };

  const renderViewPanels = () => {
    const panels = MEDIA_VIEW_PANELS[selectedMediaView];
    const rowCount = panels ? Math.max(...panels.map((o) => o.row)) : 0;
    const _output = [];

    // Render the output by row and account for column size. 1 or 2 columns wide.
    if (flow && metrics) {
      for (let i = 1; i <= rowCount; i++) {
        panels
          .filter((p) => p.row === i)
          .forEach((item, index) => {
            if (item.colWidth === 1) {
              _output.push(
                <Grid key={`${item.row}${item.column}-${index}`} item xs={6}>
                  {item.render(`Panel${index}`)}
                </Grid>
              );
            } else {
              _output.push(
                <Grid key={`${item.row}${item.column}-${index}`} item xs={12}>
                  {item.render(`Panel${index}`)}
                </Grid>
              );
            }
          });
      }
    }

    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {_output}
        </Grid>
      </Box>
    );
  };

  const handleMediaViewSelection = (view) => {
    console.log("view", view);
    setSelectedMediaView(view);
  };

  const renderAvailableViews = () => {
    return (
      <>
        <Grid container>
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
            {/* <ArrowBackOutlinedIcon /> &nbsp;&nbsp;&nbsp;&nbsp; */}
            <Typography variant="h5">
              {selectedMediaView === MEDIA_VIEW.SUMMARY
                ? "Summary"
                : selectedMediaView === MEDIA_VIEW.DETAILS
                ? "Details"
                : selectedMediaView === MEDIA_VIEW.AVAILABILITY
                ? "Availability"
                : selectedMediaView === MEDIA_VIEW.KEYMETRICS
                ? "Key Metrics"
                : "Summary"}{" "}
            </Typography>
          </Grid>
          <Grid item sx={{ mt: "12px" }}>
            <Stack direction="row" spacing={1}>
              <Chip
                sx={{ borderRadius: "20px" }}
                avatar={
                  <Avatar sx={{ backgroundColor: "rgba(60, 137, 232, 0.9)" }}>
                    <VideocamOutlinedIcon
                      sx={{ color: "#ffff", fontSize: "16px" }}
                    />
                  </Avatar>
                }
                label="Video"
                // label={getI18nString(
                //   "ivmsasm.lup.codats.Programs.BeingMonitored"
                // )}
              />
              <Chip
                sx={{ borderRadius: "20px" }}
                avatar={
                  <Avatar sx={{ backgroundColor: "#f6941f" }}>
                    <VolumeUpOutlinedIcon
                      sx={{ color: "#ffff", fontSize: "16px" }}
                    />
                  </Avatar>
                }
                label="Audio"
                // label={getI18nString(
                //   "ivmsasm.lup.codats.Programs.BeingMonitored"
                // )}
              />
              <Chip
                sx={{ borderRadius: "20px" }}
                avatar={
                  <Avatar sx={{ backgroundColor: "#FF3533" }}>
                    <ClosedCaptionOutlinedIcon
                      sx={{ color: "#ffff", fontSize: "16px" }}
                    />
                  </Avatar>
                }
                label="Closed Captioning"
                // label={getI18nString(
                //   "ivmsasm.lup.codats.Programs.BeingMonitored"
                // )}
              />
              <Chip
                sx={{ borderRadius: "20px" }}
                avatar={
                  <Avatar sx={{ backgroundColor: "#FF3533" }}>
                    <FontAwesomeIcon
                      icon={["far", "rectangle-ad"]}
                      style={{ color: "#FFFFFF", fontSize: "16px" }}
                    />
                  </Avatar>
                }
                label="Ads"
                // label={getI18nString(
                //   "ivmsasm.lup.codats.Programs.BeingMonitored"
                // )}
              />
              <Chip
                sx={{ borderRadius: "20px" }}
                avatar={
                  <Avatar sx={{ backgroundColor: "#5a5a5a" }}>
                    <SettingsOutlinedIcon
                      sx={{ color: "#4CBB17", fontSize: "16px" }}
                    />
                  </Avatar>
                }
                label="Miscellaneous"
                // label={getI18nString(
                //   "ivmsasm.lup.codats.Programs.BeingMonitored"
                // )}
              />

              <Chip
                sx={{ borderRadius: "20px" }}
                label="Clear"
                // label={getI18nString(
                //   "ivmsasm.lup.codats.Programs.BeingMonitored"
                // )}
              />
            </Stack>
          </Grid>
        </Grid>
      </>
    );
  };
  const getVideoStreamThumbnail = (flowId, program) => {
    let _thumbnail = "../shared/img/no-thumbnail.png";

    if (program?.vTnPath) {
      _thumbnail = `${getServerBaseUri(
        "OBJECT_STORAGE"
      )}/${flowId}/${encodeURIComponent(program?.vTnPath)}`;
    }

    return _thumbnail;
  };
  const renderProgramThumbnails = (wrapperKey = null) => {
    let _output = [];

    if (metrics) {
      _output.push(
        <Grid
          container
          sx={{
            width: "100%",
          }}
          key={`programDetails-${flow.id}`}
        >
          <Grid item xs={12} sx={{ paddingTop: "4px" }}>
            <div style={{ padding: "8px" }}>
              <img
                src={getVideoStreamThumbnail(
                  flow.id,
                  metrics.tsMetric.tsPgmMetric
                )}
                alt=""
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  height: "auto",
                  paddingRight: "1px",
                  paddingBottom: "1px",
                }}
              />
            </div>
          </Grid>
        </Grid>
      );
    }

    return (
      <div
        style={{
          padding: "3px",
          textAlign: "center",
          maxWidth: "640px",
          margin: "auto",
          //maxHeight: "350px",
          overflowY: "auto",
        }}
        key={wrapperKey}
      >
        {_output}
      </div>
    );
  };

  const colorRenderer = (severity) => {
    return (
      <>
        <span
          style={{
            padding: "4px 8px 4px 8px",
            color: "#ffffff",
            borderRadius: "3px",
            backgroundColor: alarmStateBgColorMap[severity],
          }}
        >
          {" "}
          {severity === "Error" ? (
            <IQIcon iconType={IQ_ICONS.ERROR} />
          ) : severity === "Healthy" ? (
            <IQIcon iconType={IQ_ICONS.GOOD} />
          ) : severity === "Warning" ? (
            <IQIcon iconType={IQ_ICONS.WARNING} />
          ) : severity === "Outage" ? (
            <IQIcon iconType={IQ_ICONS.CLOSE} />
          ) : severity === "Info" ? (
            <IQIcon iconType={IQ_ICONS.INFO} />
          ) : (
            ""
          )}{" "}
          {severity}
        </span>
      </>
    );
  };

  /* DATAGRID ROWS AND COLUMNS */
  const severityRenderer = (record, type) => {
    let alarmState = record.row.state;
    let severity = record.row.severity;

    if (type === 1) {
      //alarms
      if (alarmState.toLowerCase() === "clear") {
        severity = "healthy";
      }
    }

    return (
      <Typography
        variant="body1"
        sx={{ paddingLeft: "0px", paddingTop: "5px" }}
      >
        <span
          style={{
            padding: "4px 8px 4px 8px",
            color: "#ffffff",
            borderRadius: "3px",
            backgroundColor: alarmStateBgColorMap[severity],
          }}
        >
          {" "}
          {severity === "Error" ? (
            <IQIcon iconType={IQ_ICONS.ERROR} />
          ) : severity === "Healthy" ? (
            <IQIcon iconType={IQ_ICONS.GOOD} />
          ) : severity === "Warning" ? (
            <IQIcon iconType={IQ_ICONS.WARNING} />
          ) : severity === "Outage" ? (
            <IQIcon iconType={IQ_ICONS.CLOSE} />
          ) : severity === "Info" ? (
            <IQIcon iconType={IQ_ICONS.INFO} />
          ) : (
            ""
          )}{" "}
          {severity}
        </span>
      </Typography>
    );
  };

  const getAlarmRows = () => {
    const alarmRows = [];

    if (alarms !== undefined) {
      for (let i = 0; i < alarms.length; i++) {
        alarmRows.push({
          id: i,
          time: alarms[i].time,
          state: alarms[i].state,
          message: alarms[i].message,
          severity: alarms[i].severity,
          mnemonic: alarms[i].mnemonic,
          // description: alarms[i].description,
          entityType: alarms[i].entityType,
        });
      }
    }
    setAlarmRows(alarmRows);
  };

  const getEventRows = () => {
    const eventRows = [];

    if (events !== undefined) {
      for (let i = 0; i < events.length; i++) {
        eventRows.push({
          id: i,
          time: events[i].time,
          state: events[i].state,
          message: events[i].message,
          severity: events[i].severity,
          mnemonic: events[i].mnemonic,
          // description: events[i].description,
          entityType: events[i].entityType,
        });
      }
    }
    setEventRows(eventRows);
  };

  const alarmColumns = [
    {
      headerName: getCodaI18nString("codats.column.dtm"),
      headerClassName: "column-header",
      description: "",
      width: 150,
      align: "left",
      id: "time",
      field: "time",
      valueGetter: (params) => {
        return currentDateTimeFormattedSecs(
          getUserTimeZoneTime(params.value * 1000, timezoneOffset)
        );
      },
    },
    {
      headerName: getCodaI18nString("codats.column.state"),
      headerClassName: "column-header",
      description: "",
      width: 100,
      align: "left",
      id: "state",
      field: "state",
    },
    {
      headerName: getCodaI18nString("codats.column.severity"),
      headerClassName: "column-header",
      description: "",
      width: 100,
      align: "left",
      id: "severity",
      field: "severity",
      renderCell: (record) => {
        return severityRenderer(record, 1);
      },
    },
    {
      headerName: getCodaI18nString("codats.column.entity"),
      headerClassName: "column-header",
      description: "",
      width: 100,
      align: "left",
      id: "entityType",
      field: "entityType",
    },
    {
      headerName: getCodaI18nString("codats.column.alarm"),
      headerClassName: "column-header",
      description: "",
      width: 200,
      align: "left",
      id: "mnemonic",
      field: "mnemonic",
    },
    // {
    //   headerName: getCodaI18nString("codats.column.alarmDesc"),
    //   headerClassName: "column-header",
    //   description: "",
    //   width: 450,
    //   align: "left",
    //   id: "description",
    //   field: "description",
    // },
    {
      headerName: getCodaI18nString("codats.column.alarmMsg"),
      headerClassName: "column-header",
      description: "",
      width: 1100,
      align: "left",
      id: "message",
      field: "message",
      renderCell: (record) => (
        <Tooltip title={record.row.message}>
          <span className="table-cell-trucate">{record.row.message}</span>
        </Tooltip>
      ),
    },
    // {
    //   headerName: getCodaI18nString("codats.column.availmMsg"),
    //   headerClassName: "column-header",
    //   description: "",
    //   width: 600,
    //   align: "left",
    //   id: "availabilityMessage",
    //   field: "availabilityMessage",
    // },
  ];

  const eventColumns = [
    {
      headerName: getCodaI18nString("codats.column.dtm"),
      headerClassName: "column-header",
      description: "",
      width: 150,
      align: "left",
      id: "time",
      field: "time",
      valueGetter: (params) => {
        return currentDateTimeFormattedSecs(
          getUserTimeZoneTime(params.value * 1000, timezoneOffset)
        );
      },
    },
    {
      headerName: getCodaI18nString("codats.column.state"),
      headerClassName: "column-header",
      description: "",
      width: 100,
      align: "left",
      id: "state",
      field: "state",
    },
    {
      headerName: getCodaI18nString("codats.column.severity"),
      headerClassName: "column-header",
      description: "",
      width: 100,
      align: "left",
      id: "severity",
      field: "severity",
      renderCell: (record) => {
        return severityRenderer(record, 2);
      },
    },
    {
      headerName: getCodaI18nString("codats.column.entity"),
      headerClassName: "column-header",
      description: "",
      width: 100,
      align: "left",
      id: "entityType",
      field: "entityType",
    },
    {
      headerName: getCodaI18nString("codats.column.event"),
      headerClassName: "column-header",
      description: "",
      width: 200,
      align: "left",
      id: "mnemonic",
      field: "mnemonic",
    },
    // {
    //   headerName: getCodaI18nString("codats.column.eventDesc"),
    //   headerClassName: "column-header",
    //   description: "",
    //   width: 450,
    //   align: "left",
    //   id: "description",
    //   field: "description",
    // },
    {
      headerName: getCodaI18nString("codats.column.eventMsg"),
      headerClassName: "column-header",
      description: "",
      width: 1100,
      align: "left",
      id: "message",
      field: "message",
      renderCell: (record) => (
        <Tooltip title={record.row.message}>
          <span className="table-cell-trucate">{record.row.message}</span>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <MainContainer>
        <CssBaseline />
        <AppBarContainer position="fixed">
          <Toolbar>
            <PageHeaderWithCrumbs
              includeUpdateEvery={false}
              title={`${getCodaI18nString("codats.program.programDetails")} ${
                flow?.name ?? "Unknown"
              }`}
              name={"program name"}
              children={[
                {
                  title: getCodaI18nString("codats.program.mosaic"),
                  url: "/web/react/route/coda/codats/programMosaic",
                },
              ]}
            />
          </Toolbar>
        </AppBarContainer>
        <AppBarContainer
          position="fixed"
          open={open}
          elevation={0}
          style={{ top: "78px" }}
        >
          <Toolbar>
            {" "}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Grid
                  container
                  justifyContent="space-evenly"
                  alignItems="center"
                  className={`detailsTopTabs ${classes.tabColor}`}
                  spacing={1}
                >
                  <Grid item>{renderAvailableViews()}</Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={6}
                container
                justifyContent="flex-end"
                alignItems="center"
              >
                {/* <Grid
                    container
                    justifyContent="flex-end"
                    alignItems="center"
                    className="detailsTopTabs"
                    spacing={0}
                  > */}
                {filters.rt && (
                  <div className="topIntervalTimeWindow">
                    <UpdateEveryInterval
                      callbackFunction={refreshIntervalChanged}
                    />
                  </div>
                )}
                <div className="topIntervalTimeWindow">
                  {" "}
                  <FixedTimeWindow
                    apiFilters={filters}
                    callbackFunction={handleUpdateFilters}
                  />
                </div>
                {/* </Grid> */}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBarContainer>
        <DrawerContainer variant="permanent" open={open}>
          <DrawerHeader
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "66px",
              marginBottom: "12px",
            }}
          >
            <Typography sx={{ marginRight: "26px" }}>Program Name</Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>

          <Divider />

          <List>
            {[
              MEDIA_VIEW.SUMMARY,
              MEDIA_VIEW.DETAILS,
              MEDIA_VIEW.AVAILABILITY,
              "KEY METRICS",
            ].map((text, index) => {
              let icon;
              let listItemText;
              let tooltipText;
              if (text === MEDIA_VIEW.SUMMARY) {
                icon = (
                  <AssignmentOutlinedIcon
                    sx={{
                      color: selectedMediaView === text ? "#fff" : "inherit",
                    }}
                  />
                );
                listItemText = "Summary";
                tooltipText = "Summary";
              } else if (text === MEDIA_VIEW.DETAILS) {
                icon = (
                  <ListAltOutlinedIcon
                    sx={{
                      color: selectedMediaView === text ? "#fff" : "inherit",
                    }}
                  />
                );
                listItemText = "Details";
                tooltipText = "Details";
              } else if (text === MEDIA_VIEW.AVAILABILITY) {
                icon = (
                  <HistoryOutlinedIcon
                    sx={{
                      color: selectedMediaView === text ? "#fff" : "inherit",
                    }}
                  />
                );
                listItemText = "Availability";
                tooltipText = "Availability";
              } else if (text === "KEY METRICS") {
                icon = (
                  <AssessmentOutlinedIcon
                    sx={{
                      color: selectedMediaView === text ? "#fff" : "inherit",
                    }}
                  />
                );
                listItemText = "Key Metrics";
                tooltipText = "Key Metrics";
              }

              return (
                <ListItem
                  key={text}
                  disablePadding
                  sx={{
                    display: "block",
                    backgroundColor:
                      selectedMediaView === text
                        ? "rgba(60, 137, 232, 0.9)"
                        : "inherit",
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    selected={selectedMediaView === text}
                    onClick={() => handleMediaViewSelection(text)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {open ? (
                        icon
                      ) : (
                        <Tooltip title={tooltipText} arrow>
                          {icon}
                        </Tooltip>
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={listItemText}
                      sx={{
                        opacity: open ? 1 : 0,
                        color: selectedMediaView === text ? "#fff" : "inherit",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </DrawerContainer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: "128px" }}>
          <DrawerHeader />
          <div
            id="mainSection"
            className={`argusTsBucketStyle ${globalStyles.containerBackground}`}
            style={{ height: "800px" }}
          >
            <IQPageContent
              containerHeight={getContentAreaHeight(windowHeight)}
              className=""
            >
              {metrics && pgmVideo && pgmAudio && availabilityHistory ? (
                <>
                  <div
                    id="historyandThumbs"
                    className={`argusTsBucketDetailsWrapper  ${classes.portal}`}
                  >
                    {" "}
                    <Grid
                      container
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Grid item xs={6}>
                        {/* {renderProgramThumbnails()} */}
                        <img
                          src={`${getServerBaseUri("OBJECT_STORAGE")}/${
                            flow.id
                          }/${encodeURIComponent(programBigThumbnail)}`}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <BucketCard
                          status="InfoBox"
                          label={
                            filters.rt
                              ? getCodaI18nString("codats.program.summary1")
                              : getCodaI18nString("codats.program.summary2")
                          }
                          key="Program Status Summary"
                        >
                          <Grid
                            container
                            className="overAllStatusProgramDetails"
                          >
                            <Grid item xs={6}>
                              <Typography
                                variant="body1"
                                sx={{ paddingLeft: "5px", paddingTop: "5px" }}
                              >
                                {getCodaI18nString("codats.overall.program")}:{" "}
                                {colorRenderer(programState)}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="body1"
                                sx={{ paddingLeft: "5px", paddingTop: "5px" }}
                              >
                                {getCodaI18nString("codats.common.template")}:{" "}
                                {programTemplate === "" ? "-" : programTemplate}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="body1"
                                sx={{ paddingLeft: "5px", paddingTop: "5px" }}
                              >
                                {getCodaI18nString("codats.overall.flow")}:{" "}
                                <Link
                                  to={`/web/react/route/coda/codats/flow/${id}`}
                                  className={globalStyles.linkText}
                                >
                                  {props?.location?.state?.flowName}
                                </Link>{" "}
                                {colorRenderer(flowState)}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="body1"
                                sx={{ paddingLeft: "5px", paddingTop: "5px" }}
                              >
                                {getCodaI18nString("codats.common.template")}:{" "}
                                {flowTemplate === "" ? "-" : flowTemplate}
                              </Typography>
                            </Grid>
                          </Grid>

                          <BucketCardHeader
                            label={getCodaI18nString("codats.alarm.status")}
                          />
                          <Grid
                            container
                            className={`ProgramStatusAddPaddingHeader ${globalStyles.subHeader}`}
                          >
                            <Grid item xs={2.4}>
                              <CustomAvatar
                                backgroundColor="rgba(60, 137, 232, 0.9)"
                                icon={VideocamOutlinedIcon}
                                iconColor="#fff"
                              />
                            </Grid>
                            <Grid item xs={2.4}>
                              <CustomAvatar
                                backgroundColor="#f6941f"
                                icon={VolumeUpOutlinedIcon}
                                iconColor="#fff"
                              />
                            </Grid>
                            <Grid item xs={2.4}>
                              <CustomAvatar
                                backgroundColor="#FF3533"
                                icon={ClosedCaptionOutlinedIcon}
                                iconColor="#fff"
                              />
                            </Grid>
                            <Grid item xs={2.4}>
                              <Avatar
                                sx={{
                                  backgroundColor: "#FF3533",
                                  width: "30px",
                                  height: "30px",
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={["far", "rectangle-ad"]}
                                  style={{ color: "#FFFFFF", fontSize: "16px" }}
                                />
                              </Avatar>
                            </Grid>
                            <Grid
                              item
                              xs={2.4}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <CustomAvatar
                                backgroundColor="#5a5a5a"
                                icon={SettingsOutlinedIcon}
                                iconColor="#4CBB17"
                              />
                            </Grid>
                          </Grid>
                          {/*start summary data*/}
                          {buildAlarmColumns(alarmState, categories)}
                        </BucketCard>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={12}>
                        <BucketCard
                          status="InfoBox"
                          label={getCodaI18nString("codats.video.history")}
                          key="HISTORY-WINDOW"
                        >
                          <Grid container className="chickletContainerWrapper">
                            <Grid item xs={1} className="catTitle">
                              <Typography></Typography>
                            </Grid>
                            <Grid item xs={5} className="historyPanelStartTime">
                              {alarmHistory && alarmHistory.length > 0 && (
                                <span
                                  className={`${globalStyles.historyTimeContainer}`}
                                >
                                  {currentDateTimeFormattedSecs(
                                    getUserTimeZoneTime(
                                      alarmHistory[0]?.ts * 1000,
                                      timezoneOffset
                                    )
                                  )}
                                </span>
                              )}
                            </Grid>
                            <Grid item xs={6} className="historyPanelEndTime">
                              {alarmHistory && alarmHistory.length > 0 && (
                                <span
                                  className={`${globalStyles.historyTimeContainer}`}
                                >
                                  {currentDateTimeFormattedSecs(
                                    getUserTimeZoneTime(
                                      alarmHistory[alarmHistory.length - 1]
                                        ?.ts * 1000,
                                      timezoneOffset
                                    )
                                  )}
                                </span>
                              )}
                            </Grid>
                          </Grid>

                          <HistoryChicklets
                            title={getCodaI18nString("codats.alarm.history")}
                            data={alarmHistory}
                            start={filters.startTime}
                            end={filters.endTime}
                            agg={parseInt(filters.agg.slice(0, -1))}
                            realtime={filters.rt}
                          />

                          <HistoryChicklets
                            title={getCodaI18nString("codats.event.history")}
                            data={eventHistory}
                            agg={parseInt(filters.agg.slice(0, -1))}
                            realtime={filters.rt}
                          />

                          <HistoryChicklets
                            title={getCodaI18nString(
                              "codats.availability.history"
                            )}
                            data={availabilityHistory}
                            agg={parseInt(filters.agg.slice(0, -1))}
                            realtime={filters.rt}
                            availabilityData
                          />
                        </BucketCard>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={12}>
                        <BucketCard
                          status="InfoBox"
                          label="Thumbnails"
                          key="VIDEO-THUMBNAILS"
                        >
                          <div
                            className={`${style} thumbGalleryWrapper ${globalStyles.thumbGalleryWrapper}`}
                          >
                            {programThumbnails.map((thumb, i) => (
                              <>
                                {" "}
                                <div
                                  key={`thumbGallery${thumb.ts}`}
                                  className={`thumbGalleryImgWrapper ${globalStyles.thumbGalleryThumbnail}`}
                                >
                                  {alarmHistory && alarmHistory.length > 0 && (
                                    <div
                                      className="thumbGalleryAlarmStatus"
                                      style={{
                                        backgroundColor:
                                          alarmStateBgColorMap[
                                            alarmHistory[i]?.state
                                          ],
                                      }}
                                    ></div>
                                  )}
                                  <img
                                    src={`${getServerBaseUri(
                                      "OBJECT_STORAGE"
                                    )}/${flow.id}/${encodeURIComponent(
                                      thumb.url
                                    )}`}
                                    className="detailsThumbGallery"
                                    alt={thumb.ts}
                                  />

                                  {currentDateTimeFormattedTimeOnly(
                                    getUserTimeZoneTime(
                                      parseInt(thumb.ts) * 1000,
                                      timezoneOffset
                                    )
                                  )}
                                </div>
                              </>
                            ))}
                          </div>
                        </BucketCard>
                      </Grid>
                    </Grid>
                  </div>

                  <div
                    id="syncGraphs"
                    className={`argusTsBucketDetailsWrapper  ${classes.portal}`}
                  >
                    {renderViewPanels()}
                  </div>
                </>
              ) : (
                <div className="preLoader">
                  <i className="fa-duotone fa-spinner fa-spin-pulse"></i>
                </div>
              )}
            </IQPageContent>
          </div>
        </Box>
      </MainContainer>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  portal: {
    display: "flex",
    width: "100%",
  },
  leftColumn: {
    margin: 16,
    flex: 2,
  },
  rightColumn: {
    flex: 2,
    margin: 16,
    marginLeft: 0,
  },
  tabColor: {
    color:
      theme.palette.mode === "dark" ? theme.palette.common.white : "#8c8c8c",
  },
  listItemButtonStyle: {
    borderRadius: "8px",
  },
  overallStatus: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  inputRoot: {
    background:
      theme.palette.mode === "dark"
        ? theme.palette.background.paper
        : "#EDEDED",
    paddingLeft: "10px",
    fontSize: "13px",
  },
  option: {
    fontSize: "13px",
  },
  label: {
    fontSize: "13px",
    color: theme.palette.common.white,
  },
}));

export default ProgramDetails;
