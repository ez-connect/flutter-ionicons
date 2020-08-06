import 'package:flutter/material.dart';
import 'package:ionicons/ionicons.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Example'),
      ),
      body: Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          children: [
            Icon(Ionicons.add),
            Icon(Ionicons.add_outline),
            Icon(Ionicons.add_sharp),
          ],
        ),
      ),
    );
  }
}
