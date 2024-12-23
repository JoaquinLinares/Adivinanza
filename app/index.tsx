import { Text, View, StyleSheet, Alert } from "react-native";
import palabras from "../app/data/palabras.json"; // Asegúrate de que la ruta del archivo JSON es correcta
import { useEffect, useState } from "react";

export default function Index() {
  const [letraGuardada, setLetraGuardada] = useState(""); // Palabra seleccionada
  const [separador, setSeparador] = useState<string[]>([]); // Letras de la palabra
  const [vidas, setVidas] = useState(5); // Número de vidas
  const [letrasAdivinadas, setLetrasAdivinadas] = useState<string[]>([]); // Letras correctas
  const [letrasIntentadas, setLetrasIntentadas] = useState<string[]>([]); // Todas las letras usadas
  const [juegoTerminado, setJuegoTerminado] = useState(false); // Estado del juego
  const [Descripcion, setDescripcion] = useState("");

  // Obtener una palabra aleatoria al inicio
  useEffect(() => {
    const palabraAleatoria =
      palabras.palabras[
        Math.floor(Math.random() * palabras.palabras.length)
      ]; // Acceder correctamente a la palabra
    const palabra = palabraAleatoria.palabra.toUpperCase();
    setDescripcion(palabraAleatoria.descripcion);
    setLetraGuardada(palabra);
    setSeparador(palabra.split(""));
  }, []);

  const Detector = (letra: string) => {
    if (juegoTerminado) return; // Detener si el juego ya terminó

    if (letrasIntentadas.includes(letra)) {
      Alert.alert("¡Letra repetida!", "Ya intentaste esta letra.");
      return;
    }

    setLetrasIntentadas([...letrasIntentadas, letra]);

    if (separador.includes(letra)) {
      // Acertó
      const nuevasLetrasAdivinadas = [...letrasAdivinadas, letra];
      setLetrasAdivinadas(nuevasLetrasAdivinadas);

      // Verificar si ganó
      if (separador.every((l) => nuevasLetrasAdivinadas.includes(l))) {
        Alert.alert("¡Felicidades, ganaste!", "Has adivinado la palabra.", [
          { text: "Reiniciar", onPress: reiniciarJuego },
        ]);
        setJuegoTerminado(true);
      }
    } else {
      // No acertó
      const nuevasVidas = vidas - 1;
      setVidas(nuevasVidas);

      if (nuevasVidas === 0) {
        Alert.alert("¡Perdiste!", `La palabra era: ${letraGuardada}`, [
          { text: "Reiniciar", onPress: reiniciarJuego },
        ]);
        setJuegoTerminado(true);
      }
    }
  };

  const reiniciarJuego = () => {
    const palabraAleatoria =
      palabras.palabras[
        Math.floor(Math.random() * palabras.palabras.length)
      ]; // Acceder correctamente a la palabra
    const palabra = palabraAleatoria.palabra.toUpperCase();

    setDescripcion(palabraAleatoria.descripcion);
    setLetraGuardada(palabra);
    setSeparador(palabra.split(""));
    setVidas(5);
    setLetrasAdivinadas([]);
    setLetrasIntentadas([]);
    setJuegoTerminado(false);
  };

  return (
    <View style={styles.Pantalla}>
      <Text style={styles.Titulo}>Adivina el animal</Text>

      <View style={styles.Contenedor}>
        {/* Mostrar vidas */}
        <View style={styles.Vidas}>
          <Text style={styles.VidasTexto}>Vidas: {vidas} ❤</Text>
        </View>

        {/* Descripción de la palabra */}
        <Text style={styles.Descripcion}>{Descripcion}</Text>

        {/* Mostrar la palabra con guiones */}
        <View style={styles.Container_ahorcado}>
          {separador.map((letra, index) => (
            <Text style={styles.Letra_ahorcado} key={index}>
              {letrasAdivinadas.includes(letra) ? letra : "_"}
            </Text>
          ))}
        </View>

        {/* Teclado */}
        <View style={styles.Letras}>
          {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((fila, index) => (
            <View style={styles.TecladoFila} key={index}>
              {fila.split("").map((letra) => (
                <Text
                  style={[
                    styles.LetraTeclado,
                    letrasIntentadas.includes(letra) && styles.LetraUsada,
                  ]}
                  onPress={() => Detector(letra)}
                  key={letra}
                >
                  {letra}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  Pantalla: {
    flex: 1,
    backgroundColor: "#f0f8ff", // Fondo suave azul pastel
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  Titulo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4b9cd3", // Azul vibrante
    marginBottom: 20,
    fontFamily: "Verdana",
  },
  Contenedor: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  Vidas: {
    marginBottom: 20,
    alignItems: "center",
  },
  VidasTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff6f61",
    fontFamily: "Arial",
  },
  Descripcion: {
    fontSize: 16,
    textAlign: "center",
    color: "#555555",
    marginBottom: 20,
    fontStyle: "italic",
    fontFamily: "Georgia",
  },
  Container_ahorcado: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  Letra_ahorcado: {
    fontSize: 24,
    marginHorizontal: 8,
    textAlign: "center",
    color: "#333333",
    borderBottomWidth: 2,
    borderBottomColor: "#4b9cd3",
    fontFamily: "Courier New",
  },
  Letras: {
    alignItems: "center",
    marginTop: 20,
  },
  TecladoFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  LetraTeclado: {
    fontSize: 20,
    textAlign: "center",
    width: 30,
    height: 40,
    lineHeight: 35,
    marginHorizontal: 3.5,
    backgroundColor: "#dfefff",
    borderRadius: 8,
    color: "#4b9cd3",
    fontWeight: "bold",
    fontFamily: "Verdana",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  LetraUsada: {
    backgroundColor: "#b0bec5",
    color: "#ffffff",
  },
});
