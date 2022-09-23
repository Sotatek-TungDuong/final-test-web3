import React from 'react'
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { rem } from '../helper/px-to-rem';

const useStyles = makeStyles({
  dialogWrapper: {
    padding: `${rem(10)}`,
    position: 'absolute',
    width: `${rem(792)}`,
  },
  dialogTitle: {
    paddingRight: '0px'
  }
})

const Popup = (props) => {

  const { title, children, openPopup, setOpenPopup } = props;
  const classes = useStyles();

  return (
    <Dialog open={openPopup} maxWidth="md" classes={{ paper: classes.dialogWrapper }}>
      <DialogTitle className={classes.dialogTitle}>
        <div style={{ display: 'flex' }}>
          <Typography style={{ flexGrow: 1, paddingLeft: `${rem(290)}`, fontWeight: 700, fontSize: `${rem(26)}` }}>
            {title}
          </Typography>
          <Button
            color="secondary"
            onClick={() => {
              setOpenPopup(false)
            }}>
            <CloseIcon />
          </Button>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default Popup;