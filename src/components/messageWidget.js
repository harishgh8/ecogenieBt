import React from "react";
import logo_bw from "../assets/logo_bw.png";
import WhatsAppWidget from "react-whatsapp-chat-widget";
import "react-whatsapp-chat-widget/index.css";

const ReactApp = () => {
  return (
    <WhatsAppWidget
      phoneNo="+917676733634"
      position="right"
      widgetWidth="300px"
      widgetWidthMobile="260px"
      //   autoOpen={true}
      //   autoOpenTimer={2000}
      iconSize="60"
      iconColor="white"
      iconBgColor="#25D366"
      headerIcon={logo_bw}
      // headerIconColor="pink"
      headerTxtColor="black"
      headerBgColor="#25D366"
      headerIconBgColor="#25D366"
      headerTitle="ecoGenie Biotech"
      headerCaption="Online"
      bodyBgColor="#bbb"
      chatPersonName="Support"
      chatMessage={
        <>
          Hi 🙏 <br />
          <br /> How can we help you?
        </>
      }
      footerBgColor="#25D366"
      placeholder="Type a message.."
      btnBgColor="yellow"
      btnTxt="Start Chat"
      btnTxtColor="black"
    />
  );
};

export default ReactApp;
