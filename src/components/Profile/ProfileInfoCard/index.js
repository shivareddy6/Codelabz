import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import noImageAvailable from "../../../assets/images/no-image-available.svg";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import Divider from "@material-ui/core/Divider";

import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import LinkIcon from "@material-ui/icons/Link";
import FlagIcon from "@material-ui/icons/Flag";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import { useDispatch, useSelector } from "react-redux";
import EditProfileDetailsModal from "./editProfileDetailsModal";
import { uploadProfileImage } from "../../../store/actions";
import { useFirebase } from "react-redux-firebase";

const ProfileInfoCard = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 16 });
  const [src, setSrc] = useState(null);

  const [imageUploading, setImageUploading] = useState(false);
  const [profileEditModalVisible, setProfileEditModalVisible] = useState(false);

  const profileData = useSelector(({ firebase: { profile } }) => profile);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const verified = useSelector(
    ({
      firebase: {
        auth: { emailVerified },
      },
    }) => emailVerified
  );

  const uploadImage = (file) => {
    setImageUploading(true);
    uploadProfileImage(file, profileData.handle)(firebase, dispatch).then(() => {
      setImageUploading(false);
    });
    return false;
  };

  const checkAvailable = (data) => {
    return !!(data && data.length > 0);
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setImage(e.target.files[0]);
    }
  };

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onChangeImage = () => {
    setShowImageDialog(false);
    uploadImage(image);
  };

  return (
    <div>
      <Card className="p-0" variant="outlined">
        <Box mt={2} mb={2} m={3}>
          <Grid container>
            <Grid xs={6} md={11} lg={11} item={true}>
              <span style={{ fontSize: "1.3em", fontWeight: "480" }}>Profile Details</span>
            </Grid>
            <Grid xs={6} md={1} lg={1} item={true}>
              <div>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                  <SettingsOutlinedIcon /> Options
                </Button>
                <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={() => setProfileEditModalVisible(true)}>Edit Profile</MenuItem>
                </Menu>
              </div>
            </Grid>
          </Grid>
        </Box>
        <Divider></Divider>
        <Grid container>
          <Grid xs={12} md={3} lg={3} item={true}>
            <Box mt={6} mb={2} m={3}>
              {profileData.photoURL && profileData.photoURL.length > 0 ? (
                <img
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                  src={profileData.photoURL}
                  alt={profileData.displayName}
                  className="org-image"
                />
              ) : (
                <img
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                  src={noImageAvailable}
                  alt={"Not Available"}
                  className="org-image"
                />
              )}

              <Divider></Divider>
              {imageUploading ? (
                <Button>Loading</Button>
              ) : (
                <Box mt={4} mb={6} m={0}>
                  <center>
                    <Button
                      fullWidth
                      size="small"
                      variant="contained"
                      color="primary"
                      style={{
                        backgroundColor: "#455a64",
                      }}
                      startIcon={<CloudUploadIcon />}
                      onClick={() => setShowImageDialog(true)}
                    >
                      Change proifle picture
                    </Button>
                  </center>
                </Box>
              )}

              <Dialog fullWidth maxWidth="md" open={showImageDialog} onClose={!showImageDialog}>
                <DialogTitle id="alert-dialog-title">
                  <span style={{ fontSize: "1.3em", fontWeight: "480" }}>{"Change profile picture"}</span>
                </DialogTitle>
                <DialogContent>
                  <div>
                    <div>
                      <label for="file-upload" class="custom-file-upload">
                        Custom Upload
                      </label>
                      <Input id="file-upload" fullWidth style={{ display: "none" }} type="file" onChange={onSelectFile} />
                    </div>
                    {src && <ReactCrop src={src} crop={crop} onChange={onCropChange} />}
                  </div>
                  <Button onClick={() => setShowImageDialog(false)}>Close</Button>
                  <Button onClick={() => onChangeImage()}>Save</Button>
                </DialogContent>
              </Dialog>
            </Box>
          </Grid>
          <Grid xs={12} md={9} lg={9} item={true}>
            <Box mt={6} mb={2} m={3}>
              <p>
                <span style={{ fontSize: "1.3em", fontWeight: "bold" }}>
                  {profileData.displayName}
                  <Box>
                    {verified ? (
                      <Chip
                        size="small"
                        icon={<CheckCircleIcon />}
                        label="Email Verified"
                        color="primary"
                        style={{ backgroundColor: "LimeGreen" }}
                      />
                    ) : (
                      <Chip size="small" icon={<CancelIcon />} label="Email not verified" color="secondary" />
                    )}
                  </Box>
                </span>
              </p>
              <Box mr={12}>{checkAvailable(profileData.description) && <p className="text-justified">{profileData.description}</p>}</Box>

              {checkAvailable(profileData.link_facebook) && (
                <p>
                  <a href={"https://www.facebook.com/" + profileData.link_facebook} target="_blank" rel="noopener noreferrer">
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <Box mr={1}>
                        <FacebookIcon fontSize="small" className="facebook-color" />
                      </Box>{" "}
                      {profileData.link_facebook}
                    </div>
                  </a>
                </p>
              )}
              {checkAvailable(profileData.link_twitter) && (
                <p>
                  <a href={"https://twitter.com/" + profileData.link_twitter} target="_blank" rel="noopener noreferrer">
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <Box mr={1}>
                        <TwitterIcon fontSize="small" className="twitter-color" />{" "}
                      </Box>
                      {profileData.link_twitter}
                    </div>
                  </a>
                </p>
              )}
              {checkAvailable(profileData.link_github) && (
                <p>
                  <a href={"https://github.com/" + profileData.link_github} target="_blank" rel="noopener noreferrer">
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <Box mr={1}>
                        <GitHubIcon fontSize="small" className="github-color" />{" "}
                      </Box>
                      {profileData.link_github}
                    </div>
                  </a>
                </p>
              )}
              {checkAvailable(profileData.link_linkedin) && (
                <p>
                  <a href={"https://www.linkedin.com/in/" + profileData.link_linkedin} target="_blank" rel="noopener noreferrer">
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <Box mr={1}>
                        <LinkedInIcon fontSize="small" className="linkedin-color" />
                      </Box>{" "}
                      {profileData.link_linkedin}
                    </div>
                  </a>
                </p>
              )}
              {checkAvailable(profileData.website) && (
                <p>
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <Box mr={1}>
                        <LinkIcon fontSize="small" className="website-color" />
                      </Box>{" "}
                      {profileData.website}
                    </div>
                  </a>
                </p>
              )}
              {checkAvailable(profileData.country) && (
                <p className="mb-0">
                  <a href={"https://www.google.com/search?q=" + profileData.country} target="_blank" rel="noopener noreferrer">
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <Box mr={1}>
                        <FlagIcon fontSize="small" className="website-color" />{" "}
                      </Box>
                      {profileData.country}
                    </div>
                  </a>
                </p>
              )}
            </Box>
          </Grid>
        </Grid>
      </Card>
      <Dialog fullWidth maxWidth="md" open={profileEditModalVisible} onClose={!profileEditModalVisible}>
        <DialogTitle id="alert-dialog-title">{"Edit Profile"}</DialogTitle>
        <DialogContent>
          <EditProfileDetailsModal profileData={profileData} modelCloseCallback={(e) => setProfileEditModalVisible(e)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileInfoCard;
