import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {Godot, GodotView, useGodot} from 'react-native-godot';

/**
 * ArScreen embeds a Godot scene into the React Native application.  The
 * `react-native-godot` library allows you to load a `.pck` asset exported
 * from Godot and specify which scene to start.  Communication between
 * JavaScript and GDScript happens through the `emitMessage` and
 * `onMessage` APIs (see the library’s README for examples).  This screen
 * loads the AR scene located at `res://scenes/AR.tscn` from the `ar.pck`
 * package in the assets folder.
 */
const ArScreen: React.FC = () => {
  const godotRef = useRef<GodotView>(null);
  const {Vector3} = useGodot();
  return (
    <View style={styles.container}>
      <Godot
        ref={godotRef}
        style={styles.container}
        source={require('../../assets/ar.pck')}
        scene="res://scenes/AR.tscn"
        onMessage={message => {
          console.log('Message from Godot:', message);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ArScreen;