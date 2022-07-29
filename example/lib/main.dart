import 'package:flutter/material.dart';

import 'package:ionicons/ionicons.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Ionicons',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
      ),
      debugShowCheckedModeBanner: false,
      home: MyHomePage(),
    );
  }
}

/// Example page
class MyHomePage extends StatelessWidget {
  final outlineItems =
      ioniconsMapping.entries.where((e) => e.key.endsWith('-outline')).toList();
  final filledItems = ioniconsMapping.entries
      .where((e) => !(e.key.endsWith('-outline') && e.key.endsWith('-sharp')))
      .toList();
  final sharpItems =
      ioniconsMapping.entries.where((e) => e.key.endsWith('-sharp')).toList();

  MyHomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Flutter Ionicons'),
          bottom: const TabBar(tabs: [
            Tab(text: 'Outline'),
            Tab(text: 'Filled'),
            Tab(text: 'Sharp'),
          ]),
        ),
        body: TabBarView(
          children: [
            _ItemList(items: outlineItems),
            _ItemList(items: filledItems),
            _ItemList(items: sharpItems),
          ],
        ),
      ),
    );
  }
}

/// Render the list of icons
class _ItemList extends StatelessWidget {
  final List<MapEntry<String, String>> items;

  final _controller = ScrollController();

  _ItemList({Key? key, required this.items}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GridView.extent(
      controller: _controller,
      maxCrossAxisExtent: 86,
      childAspectRatio: 0.7,
      children: List.generate(items.length, (index) {
        final item = items[index];
        return Column(
          children: [
            Icon(IoniconsData(int.parse(item.value)), size: 64),
            const SizedBox(height: 8),
            Text(
              item.key,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12),
            ),
          ],
        );
      }),
    );
  }
}
