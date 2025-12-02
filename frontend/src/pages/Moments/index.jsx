import React, { useContext, useState, useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";

import MomentsUser from "../../components/MomentsUser";
// import MomentsQueues from "../../components/MomentsQueues";

import MainHeader from "../../components/MainHeader";
import { Grid, Paper } from "@material-ui/core";
import Title from "../../components/Title";
import ForbiddenPage from "../../components/ForbiddenPage";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: "5px",
    maxWidth: "100%"
  },
  mainPaper: {
    display: "flex",
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    alignItems: "center"
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    height: 100,
  },
  chatPapper: {
    display: "flex",
    height: "100%",
  },
  contactsHeader: {
    display: "flex",
    flexWrap: "wrap",
    padding: "0px 6px 6px 6px",
  }
}));


const ChatMoments = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  return (
    user.profile === "user" && user.allowRealTime === "disabled" ? (
      <ForbiddenPage />
    ) : (
      <MainHeader>
        <Grid style={{ width: "99.6%" }} container justifyContent="center" alignItems="flex-start">
          
          {/* --- INÍCIO DA ALTERAÇÃO: HEADER COM RELÓGIO --- */}
          <Grid xs={12} item style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px',
            paddingRight: '10px' 
          }}>
            
            {/* Espaçador invisível para manter o título centralizado */}
            <div style={{ minWidth: '200px', display: 'none' /* @media query não funciona bem inline, mas no seu CSS real funcionaria */ }}></div>

            <h1 style={{
              fontSize: '3.5rem',
              margin: 0,
              color: '#3f51b5', // var(--primaryColor) simulado
              fontWeight: 900,
              textAlign: "center",
              flexGrow: 1
            }}>
              {"Painel de Atendimentos".toUpperCase()}
            </h1>

            {/* Container do Relógio */}
            <div style={{
              padding: '1rem',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              minWidth: '200px',
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '15px'
            }}>
              <DigitalClock />
            </div>

          </Grid>
          {/* --- FIM DA ALTERAÇÃO --- */}

          <Grid style={{ width: "100%", height: "100vh" }} item >
            <Paper
              className={classes.mainPaper}
              variant="outlined"
              style={{ maxWidth: "100%" }}
            >
              <MomentsUser />
            </Paper>
          </Grid>
        </Grid>
      </MainHeader>
    )
  );
};

/* --- COMPONENTE DO RELÓGIO (Adicione isto ao final do seu arquivo ou em um arquivo separado) --- */
const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [lastPlayedMinute, setLastPlayedMinute] = useState(null);
  
  // CONFIGURAÇÃO DOS HORÁRIOS DO ALARME
  const alarmTimes = ['08:00', '12:00', '14:00', '17:30', '23:59']; 
  
  // UseRef para manter a instância do áudio sem recriar a cada render
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTimeString = `${currentHour}:${currentMinute}`;

      // Verifica se o horário bate e se ainda não tocou neste minuto
      if (alarmTimes.includes(currentTimeString) && lastPlayedMinute !== currentMinute) {
        playAlarm();
        setLastPlayedMinute(currentMinute);
      }

    }, 1000);

    return () => clearInterval(timer);
  }, [lastPlayedMinute, alarmTimes]);

  const playAlarm = () => {
    // Tenta tocar o áudio e trata erros de autoplay do navegador
    audioRef.current.play().catch(e => console.log("Interaja com a página para permitir o áudio.", e));
    console.log("⏰ ALARME TOCANDO!");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Estilos encapsulados para o relógio
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    time: {
      fontSize: '2.25rem', 
      fontFamily: 'monospace',
      fontWeight: 'bold',
      color: '#60a5fa', 
      letterSpacing: '0.1em', 
      lineHeight: '1',
    },
    label: {
      fontSize: '0.75rem', 
      color: '#9ca3af', 
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginTop: '0.25rem',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.time}>
        {formatTime(time)}
      </div>
      <div style={styles.label}>
        Horário de Brasília
      </div>
    </div>
  );
};


export default ChatMoments;
