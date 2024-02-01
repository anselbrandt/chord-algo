# chord-algo

[sgt-henderson - I need to grow away from these roots](https://news.ycombinator.com/item?id=39185623)

There's some fun music theory lurking inside this project. It turns out that every transition from one chord to another via the algorithm described is either from one chord to itself (e.g., C major to an inversion of itself or adding/removing a 7th), or one of the three basic Neo-Riemannian transformations: P, L, or R.

Go check out the Wikipedia page on Neo-Riemannian theory for more details, but here are a few key facts about P, L, and R: For any chord x, then if x is major, then P(x), L(x), and R(x) are all minor. If x is minor, then P(x), L(x) and R(x) are all major. P, L, and R are all inverses of themselves, so that P(P(x)) = x, and so on for L and R. It's possible to reach any major or minor chord from any other major or minor chord by some sequence of P, L, and R transformations. For example, from C major, applying L then R gets you to G major; applying R then P gets you to A major; and applying L then P gets you to E major.

Hopping around via Neo-Riemannian transformations are a quick way to use smooth voice leading to get to a "remote" key center (i.e., one that doesn't have many scale tones in common with the key you started in), but I was surprised when listening to the piece how (relatively) stable the harmony seemed. What's interesting here is that because of the way the algorithm is constructed, P transforms are much less common than L or R transforms (or just staying with the same chord) -- and crucially, P transforms are a vital ingredient in quickly moving to remote keys. By my rough calculations (which assume the Markov process has reached steady state and ignore the limits on min/max pitch), only 1/27th of all chord changes are P transforms. It also turns out that in steady state, 7th chords are more common than simple triads by a ratio of 16:11.
