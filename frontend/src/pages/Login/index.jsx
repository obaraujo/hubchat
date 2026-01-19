import React, { useState, useContext, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import ColorModeContext from "../../layout/themeContext";
import useSettings from "../../hooks/useSettings";
import IconButton from "@material-ui/core/IconButton";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Helmet } from "react-helmet";
import BRFlag from "../../assets/brazil.png";
import USFlag from "../../assets/unitedstates.png";
import ESFlag from "../../assets/esspain.png";
import ARFlag from "../../assets/arabe.png";
import clsx from "clsx";
import { getBackendUrl } from "../../config";
import packageJson from "../../../package.json";

const languageOptions = [
    { value: "pt-BR", label: "Português", icon: BRFlag },
    { value: "en", label: "English", icon: USFlag },
    { value: "es", label: "Spanish", icon: ESFlag },
    { value: "ar", label: "عربي", icon: ARFlag },
];

const useStyles = makeStyles((theme) => {
    const { mode } = theme;
    return ({
    loginPageGlobal: {
        backgroundRepeat: "no-repeat !important",
        backgroundSize: "cover !important",
        backgroundPosition: "center center !important",
        backgroundAttachment: "fixed !important",
        width: "100% !important",
        height: "100% !important",
        minHeight: "100vh !important",
        minWidth: "100vw !important",
        overflow: "hidden !important",
    },
    root: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0",
        margin: "0",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        backgroundColor: theme.palette.background ? theme.palette.background.default : (theme.palette.type === "light" ? "#f5f5f5" : "#303030"),
        backgroundImage: "none",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
        },
    },

    "@keyframes float": {
        "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
        "50%": { transform: "translateY(-10px) rotate(180deg)" },
    },

    containerLogin: {
        padding: "16px",
        width: "calc(100% - 32px)",
        zIndex: 10,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        position: "absolute",
        maxWidth: "420px",
        margin: "0 auto",

        [theme.breakpoints.down("sm")]: {
            width: "calc(100% - 40px)",
            maxWidth: "90%",
        },
        
        [theme.breakpoints.down("xs")]: {
            width: "calc(100% - 32px)",
            maxWidth: "85%",
        },
    },

    paper: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 1px 0 rgba(255, 255, 255, 0.2) inset,
      0 0 0 1px rgba(255, 255, 255, 0.1)
    `,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 30px",
        borderRadius: "20px",
        maxWidth: "420px",
        width: "100%",
        margin: "0 auto",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        animation: "$slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        boxSizing: "border-box",

        [theme.breakpoints.down("sm")]: {
            animation: "$slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: "16px",
            padding: "30px 25px",
            boxSizing: "border-box",
            width: "100%",
        },
        
        [theme.breakpoints.down("xs")]: {
            padding: "25px 20px",
            borderRadius: "14px",
            boxShadow: `0 15px 30px rgba(0, 0, 0, 0.12)`,
            boxSizing: "border-box",
            width: "100%",
        },
    },

    "@keyframes slideInRight": {
        from: {
            opacity: 0,
            transform: "translateY(30px)",
        },
        to: {
            opacity: 1,
            transform: "translateY(0)",
        },
    },

    "@keyframes slideInUp": {
        from: {
            opacity: 0,
            transform: "translateY(30px)",
        },
        to: {
            opacity: 1,
            transform: "translateY(0)",
        },
    },

    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "#3b82f6",
    },

    form: {
        width: "100%",
        marginTop: theme.spacing(1),
    },

    submit: {
        margin: theme.spacing(3, 0, 2),
        background: mode === "light" 
            ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` 
            : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: "white",
        borderRadius: "12px",
        padding: "12px 0",
        fontSize: "16px",
        fontWeight: 600,
        textTransform: "none",
        boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
        border: "none",
        transition: "all 0.3s ease",
        "&:hover": {
            background: mode === "light"
                ? `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.dark})`
                : `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.dark})`,
            transform: "translateY(-2px)",
            boxShadow: `0 6px 20px ${theme.palette.primary.main}66`,
        },
        "&:active": {
            transform: "translateY(0)",
        },
    },

    powered: {
        color: "white",
    },

    logoImg: {
        width: "100%",
        maxWidth: "280px",
        height: "auto",
        maxHeight: "80px",
        margin: "0 auto 20px auto",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        content: "url(" + (theme.mode === "light"
            ? theme.calculatedLogoLight()
            : theme.calculatedLogoDark()) + ")",
    },

    iconButton: {
        position: "absolute",
        top: 15,
        right: 15,
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "#374151",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "rgba(255, 255, 255, 0.2)",
            transform: "scale(1.05)",
        },
    },

    textField: {
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
            "&.Mui-focused": {
                backgroundColor: "rgba(255, 255, 255, 1)",
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
            },
            "& fieldset": {
                borderColor: "rgba(59, 130, 246, 0.2)",
            },
            "&:hover fieldset": {
                borderColor: "rgba(59, 130, 246, 0.4)",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#3b82f6",
                borderWidth: "2px",
            },
        },
        "& .MuiInputLabel-root": {
            color: "#6b7280",
            fontWeight: 500,
            "&.Mui-focused": {
                color: "#3b82f6",
            },
        },
    },

    languageSelector: {
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        padding: "8px 12px",
    },

    registerLink: {
        color: "#3b82f6",
        textDecoration: "none",
        fontWeight: 600,
        transition: "all 0.3s ease",
        "&:hover": {
            color: "#2563eb",
            textDecoration: "underline",
        },
    },

    languageDropdown: {
        display: "flex",
        alignItems: "center",
        background: "none",
        border: "none",
        color: "white",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        gap: "8px",
        transition: "opacity 0.3s ease",
        "&:hover": {
            opacity: 0.8,
        },
    },

    languageOptions: {
        position: "absolute",
        top: "100%",
        left: "0",
        marginTop: "8px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        padding: "8px",
        zIndex: 1000,
        minWidth: "140px",
    },

    languageOption: {
        background: "none",
        border: "none",
        color: "#374151",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        padding: "8px 12px",
        textAlign: "left",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
            background: "rgba(59, 130, 246, 0.1)",
            color: "#3b82f6",
        },
    },

    flagIcon: {
        width: 20,
        height: 15,
        borderRadius: 2,
    },

    versionInfo: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        padding: "6px 12px",
        color: "white",
        fontSize: "12px",
        fontWeight: 500,
        opacity: 0.8,
        transition: "opacity 0.3s ease",
        "&:hover": {
            opacity: 1,
        },
    },
})});

const Login = () => {
    const classes = useStyles();
    const theme = useTheme();
    const { colorMode } = useContext(ColorModeContext);
    const { appLogoFavicon, appName, mode } = colorMode;
    const [user, setUser] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [allowSignup, setAllowSignup] = useState(false);
    const { getPublicSetting } = useSettings();
    const { handleLogin } = useContext(AuthContext);

    const [open, setOpen] = useState(false);
    const ref = useRef();
    const [enabledLanguages, setEnabledLanguages] = useState(["pt-BR", "en"]);
    const [backgroundLight, setBackgroundLight] = useState("");
    const [backgroundDark, setBackgroundDark] = useState("");

    const getCompanyIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const companyId = urlParams.get("companyId");
        return companyId ? parseInt(companyId) : null;
    };

    const handleChangeInput = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handlSubmit = (e) => {
        e.preventDefault();
        handleLogin(user);
    };

    useEffect(() => {
        const companyId = getCompanyIdFromUrl();

        getPublicSetting("userCreation", companyId)
            .then((data) => {
                setAllowSignup(data === "enabled");
            })
            .catch((error) => {
                console.log("Error reading setting", error);
            });

        getPublicSetting("enabledLanguages", companyId)
            .then((langs) => {
                let arr = ["pt-BR", "en"];
                try {
                    if (langs) arr = JSON.parse(langs);
                } catch {}
                setEnabledLanguages(arr);
            })
            .catch(() => {
                setEnabledLanguages(["pt-BR", "en"]);
            });

        getPublicSetting("appLogoBackgroundLight", companyId)
            .then((bgLight) => {
                if (bgLight) {
                    const backendUrl = getBackendUrl();
                    const fullUrl = backendUrl + "/public/" + bgLight;
                    console.log("Background light URL:", fullUrl);
                    setBackgroundLight(fullUrl);
                } else {
                    setBackgroundLight("");
                }
            })
            .catch((err) => {
                console.error("Erro ao carregar imagem de fundo clara:", err);
                setBackgroundLight("");
            });

        getPublicSetting("appLogoBackgroundDark", companyId)
            .then((bgDark) => {
                if (bgDark) {
                    const backendUrl = getBackendUrl();
                    const fullUrl = backendUrl + "/public/" + bgDark;
                    console.log("Background dark URL:", fullUrl);
                    setBackgroundDark(fullUrl);
                } else {
                    setBackgroundDark("");
                }
            })
            .catch((err) => {
                console.error("Erro ao carregar imagem de fundo escura:", err);
                setBackgroundDark("");
            });
    }, []);

    const current =
        languageOptions.find((opt) => opt.value === i18n.language) ||
        languageOptions[0];

    const handleSelect = (opt) => {
        i18n.changeLanguage(opt.value);
        localStorage.setItem("language", opt.value);
        setOpen(false);
        window.location.reload();
    };

    let finalBackground;
    
    console.log("Modo:", mode);
    console.log("Background Light URL:", backgroundLight);
    console.log("Background Dark URL:", backgroundDark);
    
    const hasValidLightBg = backgroundLight && backgroundLight.trim() !== '';
    const hasValidDarkBg = backgroundDark && backgroundDark.trim() !== '';
    
    if (mode === "light") {
        if (hasValidLightBg) {
            finalBackground = `url(${backgroundLight})`;
            console.log("Usando background light:", finalBackground);
        } else {
            finalBackground = theme.palette.background ? theme.palette.background.default : "#f5f5f5";
            console.log("Usando cor do tema light:", finalBackground);
        }
    } else {
        if (hasValidDarkBg) {
            finalBackground = `url(${backgroundDark})`;
            console.log("Usando background dark:", finalBackground);
        } else {
            finalBackground = theme.palette.background ? theme.palette.background.default : "#303030";
            console.log("Usando cor do tema dark:", finalBackground);
        }
    }
    
    console.log("Background final definido:", finalBackground);


    return (
        <>
            <Helmet>
                <title>{appName || "AtendeChat"}</title>
                <link rel="icon" href={appLogoFavicon || "/default-favicon.ico"} />
            </Helmet>

            <div 
                className={classes.root}
                style={{
                    backgroundImage: typeof finalBackground === "string" && finalBackground.includes("url(") 
                        ? finalBackground 
                        : "none"
                }}
            >
                {/* Seletor de idioma */}
                <div
                    ref={ref}
                    className={classes.languageSelector}
                >
                    <button
                        onClick={() => setOpen((o) => !o)}
                        className={classes.languageDropdown}
                    >
                        <img
                            src={current.icon}
                            alt={current.label}
                            className={classes.flagIcon}
                        />
                        {current.label}
                        <span>▾</span>
                    </button>

                    {open && (
                        <div className={classes.languageOptions}>
                            {languageOptions
                                .filter((opt) => enabledLanguages.includes(opt.value))
                                .map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleSelect(opt)}
                                        className={classes.languageOption}
                                    >
                                        <img
                                            src={opt.icon}
                                            alt={opt.label}
                                            className={classes.flagIcon}
                                        />
                                        {opt.label}
                                    </button>
                                ))}
                        </div>
                    )}
                </div>

                <Container
                    component="main"
                    maxWidth={false}
                    className={classes.containerLogin}
                    style={{ 
                        zIndex: 10, 
                        position: "absolute", 
                        left: "50%", 
                        top: "50%", 
                        transform: "translate(-50%, -50%)",
                        boxSizing: "border-box",
                        margin: "0 auto"
                    }}
                >
                    <CssBaseline />
                    <div className={classes.paper}>
                        <IconButton
                            className={classes.iconButton}
                            onClick={colorMode.toggleColorMode}
                        >
                            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>

                        <div>
                            <img className={classes.logoImg} alt="logo" />
                        </div>

                        <form className={classes.form} noValidate onSubmit={handlSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label={i18n.t("login.form.email")}
                                name="email"
                                value={user.email}
                                onChange={handleChangeInput}
                                autoComplete="email"
                                autoFocus
                                className={classes.textField}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label={i18n.t("login.form.password")}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={user.password}
                                onChange={handleChangeInput}
                                autoComplete="current-password"
                                className={classes.textField}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                                style={{ color: "#6b7280" }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                {i18n.t("login.buttons.submit")}
                            </Button>
                            {allowSignup && (
                                <Grid container justifyContent="center">
                                    <Grid item>
                                        <Link
                                            href="#"
                                            variant="body2"
                                            component={RouterLink}
                                            to="/signup"
                                            className={classes.registerLink}
                                        >
                                            {i18n.t("login.buttons.register")}
                                        </Link>
                                    </Grid>
                                </Grid>
                            )}
                        </form>
                    </div>
                </Container>

                {/* Informação da versão */}
                <Typography className={classes.versionInfo}>
                    v{packageJson.version}
                </Typography>
            </div>
        </>
    );
};

export default Login;
