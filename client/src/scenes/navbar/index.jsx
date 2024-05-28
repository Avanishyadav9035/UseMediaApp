import React, { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpInput, setHelpInput] = useState(""); // State for help input
  const [submittedQueries, setSubmittedQueries] = useState([]); // State for storing submitted queries
  const [replyInput, setReplyInput] = useState(""); // State for reply input
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleHelpSubmit = () => {
    if (helpInput.trim()) {
      setSubmittedQueries((prevQueries) => [
        ...prevQueries,
        { query: helpInput, replies: [] },
      ]);
      setHelpInput(""); // Clear input after submission
    } else {
      console.log("Input is empty");
    }
  };

  const handleReplySubmit = (index) => () => {
    if (replyInput.trim()) {
      setSubmittedQueries((prevQueries) => {
        const updatedQueries = [...prevQueries];
        updatedQueries[index].replies.push(replyInput);
        return updatedQueries;
      });
      setReplyInput(""); // Clear input after submission
    } else {
      console.log("Reply input is empty");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Check if the search query matches available content on the home page
      const isContentAvailable = checkContentAvailability(searchQuery);

      if (isContentAvailable) {
        // Navigate to the home page
        navigate("/home");
      } else {
        // Show message indicating that content is not available
        alert("Content not available for the search query.");
      }

      setSearchQuery(""); // Clear search query after navigation or message
    } else {
      console.log("Search query is empty");
    }
  };

  const checkContentAvailability = (query) => {
    // Placeholder function to check content availability (replace with actual logic)
    // For demonstration, assume content is available if search query is not empty
    return query.trim() !== "";
  };

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          UseMedia
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            {/* Search input field */}
            <InputBase
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <IconButton onClick={handleSearch}>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton onClick={() => setIsMessengerOpen(true)}>
            <Message sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton onClick={() => setIsNotificationsOpen(true)}>
            <Notifications sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton onClick={() => setIsHelpOpen(true)}>
            <Help sx={{ fontSize: "25px" }} />
          </IconButton>

          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems
            ="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <IconButton onClick={() => setIsMessengerOpen(true)}>
              <Message sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton onClick={() => setIsNotificationsOpen(true)}>
              <Notifications sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton onClick={() => setIsHelpOpen(true)}>
              <Help sx={{ fontSize: "25px" }} />
            </IconButton>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}

      {/* Notifications Dialog */}
      <Dialog
        open={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      >
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          {/* Notifications content goes here */}
          <Typography>No new notifications</Typography>
        </DialogContent>
      </Dialog>

    {/* Messenger Dialog */}
    <Dialog
        open={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
      >
        <DialogTitle>Messenger</DialogTitle>
        <DialogContent>
          {/* Messenger content goes here */}
          <Typography>No new messages</Typography>
        </DialogContent>
      </Dialog>


      {/* Help Dialog */}
      <Dialog open={isHelpOpen} onClose={() => setIsHelpOpen(false)}>
        <DialogTitle>Help</DialogTitle>
        <DialogContent>
          <Typography>How can we assist you?</Typography>
          <TextField
            label="Enter your query"
            variant="outlined"
            fullWidth
            margin="normal"
            value={helpInput} // Bind to state
            onChange={(e) => setHelpInput(e.target.value)} // Update state on change
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleHelpSubmit} // Handle submit
          >
            Submit
          </Button>
          {/* Reply Section after submitting a query */}
          {submittedQueries.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Reply Section:
              </Typography>
              <List>
                {submittedQueries.map((queryItem, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText primary={queryItem.query} />
                    </ListItem>
                    {queryItem.replies.length > 0 && (
                      <List sx={{ pl: 2 }}>
                        {queryItem.replies.map((reply, replyIndex) => (
                          <ListItem key={replyIndex}>
                            <ListItemText primary={reply} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                    {/* Reply input for normal replies */}
                    <TextField
                      label="Your Reply"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={replyInput} // Bind to state
                      onChange={(e) => setReplyInput(e.target.value)} // Update state on change
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleReplySubmit(index)} // Handle submit
                    >
                      Submit Reply
                    </Button>
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </DialogContent>
      </Dialog>
    </FlexBetween>
  );
};

export default Navbar;
